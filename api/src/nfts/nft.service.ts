import { Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Alchemy, Network, NftExcludeFilters, NftFilters, NftOrdering, NftTokenType, OpenSeaSafelistRequestStatus, OwnedNft } from "alchemy-sdk";
import _ from "lodash";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { NFTCreationDTO, NFTModificationDTO } from "./dto/dto.nft_creation";
import { NFT } from "./interface/interface.nft";
import { formatMultipleNftInfoDTO, formatToNFTInfoDTO, NFTInfoDTO } from "./response/response.nft";
import Web3 from "web3";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StreamChat } from "stream-chat";
import { Group } from "src/group/interface/interface.group";
import { GroupCreationDTO } from "src/group/dto/dto.group";

@Injectable()
export class NFTService{
    constructor(
        @InjectModel('NFT') private readonly nftModel: Model<NFT>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel("Group") private readonly groupModel: Model<Group>){}

    // Retrieve NFT and Token at login
    async getAllAssets(user: User) {
         //const user = await this.userModel.findById("648992f1c736d1001f16bbe5")
         //await this.nftModel.deleteMany({ownedBy : user})

    const ethWalletRegex = /^0x[a-fA-F0-9]{40}$/;

    if (ethWalletRegex.test(user.wallet)) {
        // Define settings for both Ethereum and Polygon networks
        const ethSettings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        };
        const polygonSettings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.MATIC_MAINNET, // Polygon mainnet
        };

        // Initialize Alchemy instances for Ethereum and Polygon
        const alchemyEth = new Alchemy(ethSettings);
        const alchemyPolygon = new Alchemy(polygonSettings);
        const web3Eth = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
        let assetsFinals: any[] = [];

        // Initialize final assets array

        // Function to process both Ethereum and Polygon assets
        const processAssets = async (alchemyInstance, chain) => {
            // Fetch ETH/Polygon balance, NFTs, and token balances concurrently
            const [balanceWei, nftPages, tokenBalancesResponse] = await Promise.all([
                web3Eth.eth.getBalance(user.wallet),
                this.fetchAllNftPages(alchemyInstance, user.wallet),
                alchemyInstance.core.getTokenBalances(user.wallet),
            ]);

            if(chain == 'Ethereum'){
                const balance = web3Eth.utils.fromWei(balanceWei, 'ether');
                if (parseFloat(balance) > 0) {
                    assetsFinals.push({
                    ownedBy: user.id,
                    contractAddress: "0x0000000000000000000000000000000000000000",
                    floorPrice: parseFloat(balance),
                    isFav: false,
                    isNft: false,
                    title: "ETH",
                    subtitle:"ETH",
                    chain : chain,
                    collectionImage: "https://s3-eu-central-1.amazonaws.com/sirkl-bucket/1686005641798.jpg",
                    });
                }
        }

            // Process NFTs
            const nfts = this.filterValidNfts(nftPages);
            const groupedNfts = _.groupBy(nfts, "contract.address");
            Object.entries(groupedNfts).forEach(([key, group]) => {
                assetsFinals.push({
                    ownedBy: user.id,
                    title: group[0].contract.openSea.collectionName,
                    images: group.map(nft => nft.media[0].thumbnail ?? nft.media[0].gateway),
                    collectionImage: group[0].contract.openSea.imageUrl,
                    contractAddress: key,
                    floorPrice: group[0].contract.openSea.floorPrice ?? 0,
                    isFav: false,
                    isNft: true,
                    chain: chain
                });
            });

            // Process Tokens
            await Promise.all(tokenBalancesResponse.tokenBalances.map(async (token) => {
                if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    const metadata = await alchemyInstance.core.getTokenMetadata(token.contractAddress);
                    const balanceInFloat = this.convertTokenBalanceToFloat(token.tokenBalance, metadata.decimals);
                    if ((metadata.symbol && metadata.logo && metadata.name && balanceInFloat > 0) || token.contractAddress.toLowerCase() == "0x510D36e02B32ef92b43CEeffD20522d9435dED4A".toLowerCase()) {
                        assetsFinals.push({
                            ownedBy: user.id,
                            contractAddress: token.contractAddress,
                            floorPrice: balanceInFloat.toFixed(2),
                            isFav: false,
                            isNft: false,
                            title: metadata.name,
                            collectionImage: metadata.logo ?? 'https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png',
                            subtitle: metadata.symbol,
                            chain: chain
                        });
                    }
                }
            }));
        };

        // Process Ethereum and Polygon assets
        await Promise.all([
            processAssets(alchemyEth, "Ethereum"),
            processAssets(alchemyPolygon, "Polygon")
        ]);

        // Save the combined assets (NFTs and tokens)
        await this.createMultipleCollections(assetsFinals, user);
        //return assetsFinals
    }
}

    // Helper function to fetch all NFT pages
    async fetchAllNftPages(alchemy: Alchemy, wallet: string): Promise<any[]> {
                let pageKey: string | undefined;
                const nfts: any[] = [];
                
                do {
                    const nftsIter = await alchemy.nft.getNftsForOwner(wallet, {
                        omitMetadata: false,
                        orderBy: NftOrdering.TRANSFERTIME,
                        excludeFilters: [NftFilters.AIRDROPS],
                        pageKey,
                    });
                    nfts.push(...nftsIter.ownedNfts);
                    pageKey = nftsIter.pageKey;
                } while (pageKey);
            
                return nfts;
    }
            
    // Helper function to filter valid NFTs
    filterValidNfts(nfts: any[]): any[] {
                return nfts.filter(nft =>
                    nft.title.length &&
                    nft.contract.openSea &&
                    nft.contract.openSea.collectionName &&
                    nft.contract.openSea.imageUrl &&
                    nft.tokenType !== NftTokenType.UNKNOWN &&
                    (nft.tokenType !== NftTokenType.ERC1155 ||
                        (nft.tokenType === NftTokenType.ERC1155 &&
                            (nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.VERIFIED ||
                                nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.APPROVED)))
                );
    }

    async updateAssets(user: User) {
        //const user = await this.userModel.findById("66c496bf8ae589001fefdfdb")
        //const user = await this.userModel.findById("648992f1c736d1001f16bbe5")
        if(/^0x[a-fA-F0-9]{40}$/.test(user.wallet)){
    
            const existingNFTs = await this.nftModel.find({ ownedBy: user, isNft: true });
            const existingTokens = await this.nftModel.find({ ownedBy: user, isNft: false });
    
            // Define settings for both Ethereum and Polygon networks
            const ethSettings = {
                apiKey: process.env.ALCHEMY_API_KEY,
                network: Network.ETH_MAINNET,
            };
            const polygonSettings = {
                apiKey: process.env.ALCHEMY_API_KEY,
                network: Network.MATIC_MAINNET,
            };
    
            // Initialize Alchemy instances for Ethereum and Polygon
            const alchemyEth = new Alchemy(ethSettings);
            const alchemyPolygon = new Alchemy(polygonSettings);
            const web3Eth = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
    
            let assetsFinals = [];
    
            // Helper function to process both Ethereum and Polygon assets
            const processAssets = async (alchemyInstance: Alchemy, networkName: string) => {
                const [balanceWei, nftPages, tokenBalancesResponse] = await Promise.all([
                    web3Eth.eth.getBalance(user.wallet),
                    this.fetchAllNftPages(alchemyInstance, user.wallet),
                    alchemyInstance.core.getTokenBalances(user.wallet),
                ]);
    
                // Process balance for each network
                if(networkName == 'Ethereum'){
                const balance = parseFloat(web3Eth.utils.fromWei(balanceWei, 'ether'));
                if (balance > 0) {
                    assetsFinals.push({
                        ownedBy: user.id,
                        contractAddress: "0x0000000000000000000000000000000000000000",
                        floorPrice: balance,
                        isFav: false,
                        isNft: false,
                        title: 'ETH',
                        subtitle: 'ETH',
                        collectionImage: "https://s3-eu-central-1.amazonaws.com/sirkl-bucket/1686005641798.jpg",
                        chain: networkName
                    });
                }
            }
    
                // Process NFTs for each network
                const nfts = this.filterValidNfts(nftPages);
                const groupedNfts = _.groupBy(nfts, "contract.address");
                Object.entries(groupedNfts).forEach(([key, group]) => {
                    assetsFinals.push({
                        ownedBy: user.id,
                        title: group[0].contract.openSea.collectionName,
                        images: group.map(nft => nft.media[0].thumbnail ?? nft.media[0].gateway),
                        collectionImage: group[0].contract.openSea.imageUrl,
                        contractAddress: key,
                        floorPrice: group[0].contract.openSea.floorPrice ?? 0,
                        isFav: false,
                        isNft: true,
                        chain: networkName
                    });
                });
    
                // Process Tokens
                await Promise.all(tokenBalancesResponse.tokenBalances.map(async (token) => {
                    if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                        const metadata = await alchemyInstance.core.getTokenMetadata(token.contractAddress);
                        const balanceInFloat = this.convertTokenBalanceToFloat(token.tokenBalance, metadata.decimals);
                        if (metadata.symbol && metadata.logo && metadata.name && balanceInFloat > 0 || token.contractAddress.toLowerCase() == "0x510D36e02B32ef92b43CEeffD20522d9435dED4A".toLowerCase()) {
                            assetsFinals.push({
                                ownedBy: user.id,
                                contractAddress: token.contractAddress,
                                floorPrice: balanceInFloat.toFixed(2),
                                isFav: false,
                                isNft: false,
                                title: metadata.name,
                                collectionImage: metadata.logo ?? 'https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png',
                                subtitle: metadata.symbol,
                                chain: networkName
                            });
                        }
                    }
                }));
            };
    
            // Process both Ethereum and Polygon assets concurrently
            await Promise.all([
                processAssets(alchemyEth, 'Ethereum'),
                processAssets(alchemyPolygon, 'Polygon')
            ]);
    
            // Update and process NFTs and tokens
            const toUpdateNFTs = assetsFinals.filter(newAsset =>
                newAsset.isNft === true &&
                existingNFTs.some(existingNft =>
                    existingNft.contractAddress === newAsset.contractAddress &&
                    existingNft.images?.length !== newAsset.images?.length
                )
            );
    
            const toRemoveNFTs = existingNFTs
                .filter(existingNft => 
                    existingNft.isNft === true &&
                    !assetsFinals.some(newAsset => newAsset.contractAddress === existingNft.contractAddress))
                .map(nft => nft.contractAddress);
    
            const toAddNFTs = assetsFinals
                .filter(newAsset => 
                    newAsset.isNft === true &&
                    !existingNFTs.some(existingNft => existingNft.contractAddress === newAsset.contractAddress));
    
            // Update NFTs
            await Promise.all(toUpdateNFTs.map(nft => 
                this.nftModel.findOneAndUpdate(
                    { contractAddress: nft.contractAddress },
                    { images: nft.images },
                    { new: true, useFindAndModify: false }
                )
            ));
    
            // Remove NFTs
            await this.nftModel.deleteMany({ contractAddress: { $in: toRemoveNFTs } });
    
            // Add new NFTs
            await this.createMultipleCollections(toAddNFTs, user);
    
            // Determine Tokens to Remove/Add
            const toRemoveTokens = existingTokens
                .filter(existingToken =>
                    existingToken.isNft == false && 
                     !assetsFinals.some(newAsset => newAsset.contractAddress === existingToken.contractAddress))
                .map(token => token.contractAddress);
    
            const toAddTokens = assetsFinals
                .filter(newAsset =>
                    newAsset.isNft == false &&
                     !existingTokens.some(existingToken => existingToken.contractAddress === newAsset.contractAddress));
    
            // Remove Tokens
            await this.nftModel.deleteMany({ contractAddress: { $in: toRemoveTokens } });
    
            // Add new Tokens
            await this.createMultipleCollections(toAddTokens, user);
        }
    }

    // Helper function to convert given balance to float
    convertTokenBalanceToFloat(tokenBalanceHex: string, decimals: number): number {
        // Convert the hexadecimal balance to a BigNumber
        const balanceInWei = Web3.utils.toBN(tokenBalanceHex);
    
        // Convert to a floating-point number using the appropriate decimals
        const balanceInEther = Web3.utils.fromWei(balanceInWei, 'ether'); // 'ether' assumes 18 decimals
    
        // Adjust for other decimals
        return parseFloat(balanceInEther) / Math.pow(10, 18 - decimals);
    }
    
    // Helper function to create multiple collections
    async createMultipleCollections(data: NFTCreationDTO[], user: User) {
        
        const existingCollections = await this.nftModel.find({ ownedBy: user});
        const newCollections = data.filter(item => !existingCollections.some(existing => existing.contractAddress === item.contractAddress));
        
        if (newCollections.length > 0) {
            const created = await this.nftModel.insertMany(newCollections.map(item => ({
                ownedBy: user.id,
                title: item.title,
                images: item.images,
                collectionImage: item.collectionImage,
                contractAddress: item.contractAddress,
                isFav: false,
                floorPrice: item.floorPrice,
                isNft: item.isNft,
                subtitle: item.subtitle,
                chain: item.chain
            })));
            return created.map(doc => formatToNFTInfoDTO(doc));
        }
        return [];
    }

    // Function to retrieve NFT and Token for a given user (with param for favorites)
    async retrieveAssets(user: User, id: string, offset: number, fav : boolean){
        let res;
        let userToId;
        if(id === user.id) userToId = user
        else userToId = await this.userModel.findById(id)
        if(fav) res = await this.nftModel.find({ownedBy: userToId, isFav: true}).sort({floorPrice: "descending"}).skip(offset * 12).limit(12).exec();
        else res = await this.nftModel.find({ownedBy: userToId}).sort({floorPrice: "descending"}).skip(offset * 12).limit(12).exec();
        return formatMultipleNftInfoDTO(res)
    }

    // Function to update the NFT or Token status (fav)
    async updateAssetStatus(data: NFTModificationDTO, user: User){
        let userToId;
        if(data.id === user.id) userToId = user
        else userToId = await this.userModel.findById(data.id)
        const nft = await this.nftModel.findOne({ownedBy: userToId, contractAddress: data.contractAddress})
        nft.isFav = data.isFav
        await nft.save()
        return formatToNFTInfoDTO(nft)
    }

    async retrieveContractAddresses(user: User) {
        try{
            if(/^0x[a-fA-F0-9]{40}$/.test(user.wallet)) {
    
            const apiKey = process.env.STREAM_API_KEY;
            const secret = process.env.STREAM_SECRET;
            const streamClient = StreamChat.getInstance(apiKey, secret);
    
            // Define settings for both Ethereum and Polygon networks
            const ethSettings = {
                apiKey: process.env.ALCHEMY_API_KEY,
                network: Network.ETH_MAINNET,
            };
            const polygonSettings = {
                apiKey: process.env.ALCHEMY_API_KEY,
                network: Network.MATIC_MAINNET, // Polygon mainnet
            };
    
            // Initialize Alchemy instances for Ethereum and Polygon
            const alchemyEth = new Alchemy(ethSettings);
            const alchemyPolygon = new Alchemy(polygonSettings);
            const web3Eth = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
    
            const uniqueContractAddresses = new Set<string>();
    
            // Fetch ETH and MATIC balances and add to set if greater than 0
            const ethBalancePromise = web3Eth.eth.getBalance(user.wallet).then(ethBalanceWei => {
                const ethBalance = parseFloat(web3Eth.utils.fromWei(ethBalanceWei, 'ether'));
                if (ethBalance > 0) uniqueContractAddresses.add("0x0000000000000000000000000000000000000000");
            });
    
            // Fetch NFT contract addresses for Ethereum and Polygon concurrently
            const nftEthPromise = this.fetchNftsForNetwork(alchemyEth, user.wallet, uniqueContractAddresses);
            const nftPolygonPromise = this.fetchNftsForNetwork(alchemyPolygon, user.wallet, uniqueContractAddresses);
    
            // Fetch Token contract addresses for Ethereum and Polygon concurrently
            const tokenEthPromise = this.fetchTokensForNetwork(alchemyEth, user.wallet, uniqueContractAddresses);
            const tokenPolygonPromise = this.fetchTokensForNetwork(alchemyPolygon, user.wallet, uniqueContractAddresses);
    
            // Wait for all promises to resolve
            await Promise.all([ethBalancePromise, nftEthPromise, nftPolygonPromise, tokenEthPromise, tokenPolygonPromise]);
    
            // Convert set to array
            const contractAddresses = Array.from(uniqueContractAddresses);
    
            // Add user to corresponding Stream Chat groups concurrently
            const addUserPromises = contractAddresses.map(async (contractAddress) => {
                const channel = streamClient.channel('try', contractAddress);
    
                try {
                    await channel.addMembers([user.id]);
                } catch (error) {
                    if (error.message.includes("Can't find channel")) {
                        console.log(`Channel with ID ${contractAddress} does not exist. Skipping.`);
                    } else {
                        console.error("Error while checking channel:", error);
                    }
                }
            });
    
            // Retrieve user channels and remove from channels that no longer apply
            /*const userChannelsPromise = streamClient.queryChannels({
                members: { $in: [user.id] },
                isConv: { $exists: false }
            });
    
            const removeUserPromises = userChannelsPromise.then(userChannels => {
                return Promise.all(userChannels.map(async (channel) => {
                    if (!uniqueContractAddresses.has(channel.id)) {
                        try {
                            await channel.removeMembers([user.id]);
                            console.log(`Removed user from channel ${channel.id}`);
                        } catch (error) {
                            console.error(`Failed to remove user from channel ${channel.id}:`, error);
                        }
                    }
                }));
            });
    
            // Wait for both adding and removing users to complete
            await Promise.all([...
                addUserPromises, 
                removeUserPromises]);*/

            await Promise.all([addUserPromises])
    
            return contractAddresses;
        }
    } catch (error) {
        console.error("An error occurred in retrieveContractAddresses:", error.message);
        throw new InternalServerErrorException("Failed to retrieve contract addresses.");
    }
    }
    
    // Helper function to fetch NFTs for a given network (Ethereum or Polygon)
    async fetchNftsForNetwork(alchemy: Alchemy, wallet: string, uniqueContractAddresses: Set<string>) {
        let pageKey: string | undefined;
        do {
            const nfts = await alchemy.nft.getNftsForOwner(wallet, {
                omitMetadata: false,
                excludeFilters: [NftFilters.AIRDROPS],
                pageKey,
            });

    
            const validNfts = nfts.ownedNfts.filter(nft =>
                nft.title.length &&
                nft.contract.openSea &&
                nft.contract.openSea.collectionName &&
                nft.contract.openSea.imageUrl &&
                nft.tokenType !== NftTokenType.UNKNOWN &&
                (nft.tokenType !== NftTokenType.ERC1155 ||
                    (nft.tokenType === NftTokenType.ERC1155 &&
                        (nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.VERIFIED ||
                            nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.APPROVED)))
            );
    
            validNfts.forEach(nft => uniqueContractAddresses.add(nft.contract.address));
            pageKey = nfts.pageKey;

            /*const contracts = await alchemy.nft.getContractsForOwner(wallet, {excludeFilters: [NftFilters.AIRDROPS], pageKey})
            contracts.contracts.forEach((nft) => {
                if(!nft.isSpam) uniqueContractAddresses.add(nft.address)
            })
            pageKey = contracts.pageKey;*/
        } while (pageKey);
    }
    
    // Helper function to fetch tokens for a given network (Ethereum or Polygon)
    async fetchTokensForNetwork(alchemy: Alchemy, wallet: string, uniqueContractAddresses: Set<string>) {
        const tokenBalances = await alchemy.core.getTokenBalances(wallet);
        tokenBalances.tokenBalances.forEach(token => {
            if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                uniqueContractAddresses.add(token.contractAddress);
            }
        });
    }

    async retrieveAssetToCreateNewGroup(user, offset: number): Promise<GroupCreationDTO[]> {
        //const user = await this.userModel.findById("66c496bf8ae589001fefdfdb")
       // const user = await this.userModel.findById("648992f1c736d1001f16bbe5")

        const apiKey = process.env.ALCHEMY_API_KEY;
        const ethSettings = {
            apiKey,
            network: Network.ETH_MAINNET,
        };
        const polygonSettings = {
            apiKey,
            network: Network.MATIC_MAINNET,
        };
    
        // Initialize Alchemy instances for Ethereum and Polygon
        const alchemyEth = new Alchemy(ethSettings);
        const alchemyPolygon = new Alchemy(polygonSettings);
    
        // Retrieve existing groups' contract addresses
        const groupsAlreadyExisting = await this.groupModel.find().select('contractAddress');
        //////// TO LOWERCASE TO MATCH BUT CHECK MULTIPLE SAME ITEMS
        const existingContractsSet = new Set(groupsAlreadyExisting.map(group => group.contractAddress.toLowerCase()));
    
        // A set to store the unique contract addresses of the user's assets
        const uniqueAssets = new Set<string>();
        const assetsFinals: GroupCreationDTO[] = [];
    
        // Helper function to process network assets (NFTs + Tokens) with offset
        const processAssetsForNetwork = async (alchemyInstance: Alchemy, wallet: string, offset: number, uniqueAssets: Set<string>) => {
            const limit = 100; // Define the number of items to fetch in each offset step

                        // Fetch Tokens
                        const tokenPromise = alchemyInstance.core.getTokenBalances(wallet).then(async (tokenBalances) => {
                            await Promise.all(tokenBalances.tokenBalances.map(async (token) => {
                                if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000" &&
                                    !existingContractsSet.has(token.contractAddress)) {
                                    
                                    // Fetch metadata for each token
                                    const metadata = await alchemyInstance.core.getTokenMetadata(token.contractAddress);
                                    
                                    // Exclude tokens without name or symbol
                                    if (metadata.name && metadata.symbol) {
                                        uniqueAssets.add(token.contractAddress);
                                        assetsFinals.push({
                                            contractAddress: token.contractAddress,
                                            name: metadata.name,
                                            picture: metadata.logo || 'https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png',
                                        });
                                    }
                                }
                            }));
                        });
    
            // Fetch NFTs
            const nftPromise = (async () => {
                let pageKey: string | undefined;
                let fetched = 0;
                do {
                    const nfts = await alchemyInstance.nft.getNftsForOwner(wallet, {
                        omitMetadata: false,
                        excludeFilters: [NftFilters.AIRDROPS],
                        pageKey,
                    });

                    const validNfts = nfts.ownedNfts.filter(nft =>
                        nft.title.length &&
                        nft.contract.openSea &&
                        nft.contract.openSea.collectionName &&
                        nft.contract.openSea.imageUrl &&
                        nft.tokenType !== NftTokenType.UNKNOWN &&
                        (nft.tokenType !== NftTokenType.ERC1155 ||
                            (nft.tokenType === NftTokenType.ERC1155 &&
                                (nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.VERIFIED ||
                                    nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.APPROVED)))
                    );
    
                    validNfts.forEach(nft => {
                        const contractAddress = nft.contract.address.toLowerCase();
                        if (!existingContractsSet.has(contractAddress) && !uniqueAssets.has(contractAddress)) {
                            uniqueAssets.add(nft.contract.address);
                            assetsFinals.push({
                                contractAddress: nft.contract.address,
                                name: nft.contract.openSea?.collectionName,
                                picture: nft.contract.openSea?.imageUrl || nft.media[0]?.gateway || '',
                            });
                        }
                    });
    
                    fetched += validNfts.length;
                    pageKey = nfts.pageKey;
                } while (pageKey && fetched < offset + limit);
            })();
    
            await Promise.all([nftPromise, tokenPromise]);
        };
    
        // Process assets for Ethereum and Polygon with offset
        await Promise.all([
            processAssetsForNetwork(alchemyEth, user.wallet, offset, uniqueAssets),
            processAssetsForNetwork(alchemyPolygon, user.wallet, offset, uniqueAssets)
        ]);
    
        // Convert the final assets to paginated results
        const paginatedAssets = assetsFinals.slice(offset, offset + 100);
    
        return paginatedAssets;
    }


}










        /*
    
    async updateAssetsOriginal(user: User) {

        if(/^0x[a-fA-F0-9]{40}$/.test(user.wallet)){

        //const user = await this.userModel.findById("648992f1c736d1001f16bbe5")

        // Fetch existing NFTs and tokens from the database
        const existingNFTs = await this.nftModel.find({ ownedBy: user, isNft: true });
        const existingTokens = await this.nftModel.find({ ownedBy: user, isNft: false });
    
        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        };
    
        const alchemy = new Alchemy(settings);
        const web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
    
        let nfts: any[] = [];
        let pageKey: string | undefined;
    
        // Fetch NFTs from Alchemy
        do {
            const nftsIter = await alchemy.nft.getNftsForOwner(user.wallet, {
                omitMetadata: false,
                orderBy: NftOrdering.TRANSFERTIME,
                pageKey,
            });
    
            const validNfts = nftsIter.ownedNfts.filter(nft =>
                nft.title.length &&
                nft.contract.openSea &&
                nft.contract.openSea.collectionName &&
                nft.contract.openSea.imageUrl &&
                nft.tokenType !== NftTokenType.UNKNOWN &&
                (nft.tokenType !== NftTokenType.ERC1155 ||
                    (nft.tokenType === NftTokenType.ERC1155 &&
                    (nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.VERIFIED ||
                    nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.APPROVED)))
            );
    
            nfts.push(...validNfts);
            pageKey = nftsIter.pageKey;
    
        } while (pageKey);
    
        // Group NFTs by contract address
        const groupedNFTs = _.groupBy(nfts, "contract.address");
    
        // Prepare final NFTs data
        const nftsFinals = Object.entries(groupedNFTs).map(([contractAddress, group]) => ({
            ownedBy: user.id,
            title: group[0].contract.openSea.collectionName,
            images: group.map(nft => nft.media[0].thumbnail ?? nft.media[0].gateway),
            collectionImage: group[0].contract.openSea.imageUrl,
            contractAddress,
            floorPrice: group[0].contract.openSea.floorPrice ?? 0,
            isNft: true,
        }));
    
        // Determine NFTs to update, remove, and add
        const toUpdateNFTs = nftsFinals.filter(newNft =>
            existingNFTs.some(existingNft =>
                existingNft.contractAddress === newNft.contractAddress &&
                existingNft.images.length !== newNft.images.length
            )
        );
    
        const toRemoveNFTs = existingNFTs
            .filter(existingNft => !nftsFinals.some(newNft => newNft.contractAddress === existingNft.contractAddress))
            .map(nft => nft.contractAddress);
    
        const toAddNFTs = nftsFinals
            .filter(newNft => !existingNFTs.some(existingNft => existingNft.contractAddress === newNft.contractAddress));
    
        // Update NFTs
        for (const nft of toUpdateNFTs) {
            await this.nftModel.findOneAndUpdate(
                { contractAddress: nft.contractAddress },
                { images: nft.images },
                { new: true, useFindAndModify: false }
            );
        }
    
        // Remove NFTs
        for (const contractAddress of toRemoveNFTs) {
            await this.nftModel.findOneAndDelete({ contractAddress });
        }
    
        // Add new NFTs
        await this.createMultipleCollections(toAddNFTs, user);
    
        // Handle Tokens
        const tokensFinals = [];
    
        // Fetch Ethereum balance and add it to the final tokens list
        const ethBalanceWei = await web3.eth.getBalance(user.wallet);
        const ethBalance = parseFloat(web3.utils.fromWei(ethBalanceWei, 'ether'));
    
        if (ethBalance > 0) {
            tokensFinals.push({
                ownedBy: user.id,
                contractAddress: "0x0000000000000000000000000000000000000000",
                floorPrice: ethBalance,
                title: "ETH",
                subtitle: "ETH",
                collectionImage: "https://s3-eu-central-1.amazonaws.com/sirkl-bucket/1686005641798.jpg",
                isNft: false,
            });
        }
    
        // Fetch token balances
        const tokenBalancesResponse = await alchemy.core.getTokenBalances(user.wallet);
    
        // Filter tokens with balance greater than zero and fetch metadata
        for (const token of tokenBalancesResponse.tokenBalances) {
            if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                const balanceInFloat = this.convertTokenBalanceToFloat(token.tokenBalance, metadata.decimals);
                if (metadata.symbol && metadata.logo && metadata.name && balanceInFloat > 0) {
                    tokensFinals.push({
                        ownedBy: user.id,
                        contractAddress: token.contractAddress,
                        floorPrice: balanceInFloat.toFixed(2),
                        title: metadata.name,
                        subtitle: metadata.symbol,
                        collectionImage: metadata.logo,
                        isNft: false,
                        
                    });
                }
            }
        }

        const toRemoveTokens = existingTokens
            .filter(existingToken => !tokensFinals.some(newToken => newToken.contractAddress === existingToken.contractAddress))
            .map(token => token.contractAddress);
    
        const toAddTokens = tokensFinals
            .filter(newToken => !existingTokens.some(existingToken => existingToken.contractAddress === newToken.contractAddress));

    
        // Remove Tokens
        for (const contractAddress of toRemoveTokens) {
            await this.nftModel.findOneAndDelete({ contractAddress });
        }
    
        // Add new Tokens
        await this.createMultipleCollections(toAddTokens, user);
        }
    }

       // Retrieve NFT and Token at login
       async getAllAssets(usedr : User) {

        const user = await this.userModel.findById("648992f1c736d1001f16bbe5")
        if(/^0x[a-fA-F0-9]{40}$/.test(user.wallet)){
        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        };
        const alchemy = new Alchemy(settings);
        const web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
    
        let assetsFinals: any[] = [];
    
        // Fetch Ethereum balance, NFTs, and token balances concurrently
        const [ethBalanceWei, nftPages, tokenBalancesResponse] = await Promise.all([
            web3.eth.getBalance(user.wallet),
            this.fetchAllNftPages(alchemy, user.wallet),
            alchemy.core.getTokenBalances(user.wallet),
        ]);
    
        // Process Ethereum balance
        const ethBalance = web3.utils.fromWei(ethBalanceWei, 'ether');
        if (parseFloat(ethBalance) > 0) {
            assetsFinals.push({
                ownedBy: user.id,
                contractAddress: "0x0000000000000000000000000000000000000000",
                floorPrice: parseFloat(ethBalance),
                isFav: false,
                isNft: false,
                title: "ETH",
                subtitle: "ETH",
                collectionImage: "https://s3-eu-central-1.amazonaws.com/sirkl-bucket/1686005641798.jpg",
            });
        }
    
        // Process NFTs
        const nfts = this.filterValidNfts(nftPages);
        const groupedNfts = _.groupBy(nfts, "contract.address");
        Object.entries(groupedNfts).forEach(([key, group]) => {
            assetsFinals.push({
                ownedBy: user.id,
                title: group[0].contract.openSea.collectionName,
                images: group.map(nft => nft.media[0].thumbnail ?? nft.media[0].gateway),
                collectionImage: group[0].contract.openSea.imageUrl,
                contractAddress: key,
                floorPrice: group[0].contract.openSea.floorPrice ?? 0,
                isFav: false,
                isNft: true,
            });
        });
    
        // Process Tokens
        await Promise.all(tokenBalancesResponse.tokenBalances.map(async (token) => {
            if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                const balanceInFloat = this.convertTokenBalanceToFloat(token.tokenBalance, metadata.decimals);
                if (metadata.symbol && metadata.logo && metadata.name && balanceInFloat > 0) {
                    assetsFinals.push({
                        ownedBy: user.id,
                        contractAddress: token.contractAddress,
                        floorPrice: balanceInFloat.toFixed(2),
                        isFav: false,
                        isNft: false,
                        title: metadata.name,
                        collectionImage: metadata.logo,
                        subtitle: metadata.symbol,
                    });
                }
            }
        }));
    
        // Save the combined assets (NFTs and tokens)
        //await this.createMultipleCollections(assetsFinals, user);
        return assetsFinals
    }
    }

    // Function to retrieve contract address for a given user and add or remove him from groups
    async retrieveContractAddresse(user): Promise<string[]> {
        if(/^0x[a-fA-F0-9]{40}$/.test(user.wallet)){

        const apiKey = process.env.STREAM_API_KEY;
        const secret = process.env.STREAM_SECRET;
        const streamClient = StreamChat.getInstance(apiKey, secret);
    
        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        };
    
        const web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`));
        const alchemy = new Alchemy(settings);
    
        const uniqueContractAddresses = new Set<string>();
    
        // Fetch ETH balance and add to set if greater than 0
        const ethBalancePromise = web3.eth.getBalance(user.wallet).then(ethBalanceWei => {
            const ethBalance = parseFloat(web3.utils.fromWei(ethBalanceWei, 'ether'));
            if (ethBalance > 0) uniqueContractAddresses.add("0x0000000000000000000000000000000000000000");
        });
    
        // Fetch NFT contract addresses concurrently
        const nftPromise = (async () => {
            let pageKey: string | undefined;
            do {
                const nfts = await alchemy.nft.getNftsForOwner(user.wallet, {
                    omitMetadata: false,
                    excludeFilters: [NftFilters.AIRDROPS],
                    pageKey,
                });
    
                const validNfts = nfts.ownedNfts.filter(nft =>
                    nft.title.length &&
                    nft.contract.openSea &&
                    nft.contract.openSea.collectionName &&
                    nft.contract.openSea.imageUrl &&
                    nft.tokenType !== NftTokenType.UNKNOWN &&
                    (nft.tokenType !== NftTokenType.ERC1155 ||
                        (nft.tokenType === NftTokenType.ERC1155 &&
                            (nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.VERIFIED ||
                                nft.contract.openSea.safelistRequestStatus === OpenSeaSafelistRequestStatus.APPROVED)))
                );
    
                validNfts.forEach(nft => uniqueContractAddresses.add(nft.contract.address));
                pageKey = nfts.pageKey;
            } while (pageKey);
        })();
    
        // Fetch Token contract addresses concurrently
        const tokenPromise = alchemy.core.getTokenBalances(user.wallet).then(tokenBalances => {
            tokenBalances.tokenBalances.forEach(token => {
                if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    uniqueContractAddresses.add(token.contractAddress);
                }
            });
        });
    
        // Wait for all promises to resolve
        await Promise.all([ethBalancePromise, nftPromise, tokenPromise]);
    
        // Convert set to array
        const contractAddresses = Array.from(uniqueContractAddresses);
    
        // Add user to corresponding Stream Chat groups concurrently
        const addUserPromises = contractAddresses.map(async (contractAddress) => {
            const channel = streamClient.channel('try', contractAddress);
    
            try {
                await channel.watch();
                await channel.addMembers([user.id]);
            } catch (error) {
                if (error.message.includes("Can't find channel")) {
                    console.log(`Channel with ID ${contractAddress} does not exist. Skipping.`);
                } else {
                    console.error("Error while checking channel:", error);
                }
            }
        });
    
        // Retrieve user channels and remove from channels that no longer apply
        const userChannelsPromise = streamClient.queryChannels({
            members: { $in: [user.id] },
            isConv: { $exists: false }
        });
    
        const removeUserPromises = userChannelsPromise.then(userChannels => {
            return Promise.all(userChannels.map(async (channel) => {
                if (!uniqueContractAddresses.has(channel.id)) {
                    try {
                        await channel.removeMembers([user.id]);
                        console.log(`Removed user from channel ${channel.id}`);
                    } catch (error) {
                        console.error(`Failed to remove user from channel ${channel.id}:`, error);
                    }
                }
            }));
        });
    
        // Wait for both adding and removing users to complete
        Promise.all([...addUserPromises, removeUserPromises]);
    
        return contractAddresses;
        }
    }
    
    */


