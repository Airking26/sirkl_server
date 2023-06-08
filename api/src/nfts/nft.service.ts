import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Alchemy, Network, NftFilters, NftOrdering, NftTokenType, OpenSeaSafelistRequestStatus, OwnedNft } from "alchemy-sdk";
import _ from "lodash";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { NFTCreationDTO, NFTModificationDTO } from "./dto/dto.nft_creation";
import { NFT } from "./interface/interface.nft";
import { formatMultipleNftInfoDTO, formatToNFTInfoDTO, NFTInfoDTO } from "./response/response.nft";

@Injectable()
export class NFTService{
    constructor(@InjectModel('NFT') private readonly nftModel: Model<NFT>,@InjectModel('User') private readonly userModel: Model<User>){}

    async createMultipleCollections(data: NFTCreationDTO[], user: User){
        const res = await Promise.all(data.map(it => this.createCollection(it, user)))
        if(!res) throw new NotAcceptableException("ERROR_CREATING_MULTIPLE_NFT_COLLECTION")
        return res
    }

    async createCollection(data: NFTCreationDTO, user: User){
        const exists = await this.nftModel.findOne({ownedBy: user, contractAddress: data.contractAddress})
        if(!exists){
        const nft = new this.nftModel({ownedBy: user.id, title: data.title, images: data.images, collectionImage: data.collectionImage, contractAddress: data.contractAddress, isFav: false, floorPrice: data.floorPrice})
        const res = await nft.save()
        await this.nftModel.populate(res, "ownedBy")
        return formatToNFTInfoDTO(res)
        }
    }

    async retrieveNFT(user: User, id: string, offset: number, fav : boolean){
        let res;
        let userToId;
        if(id === user.id) userToId = user
        else userToId = await this.userModel.findById(id)
        if(fav) res = await this.nftModel.find({ownedBy: userToId, isFav: true}).sort({floorPrice: "descending"}).skip(offset * 12).limit(12).exec();
        else res = await this.nftModel.find({ownedBy: userToId}).sort({floorPrice: "descending"}).skip(offset * 12).limit(12).exec();
        return formatMultipleNftInfoDTO(res)
    }

    async updateNFT(user: User){
        const res = await this.nftModel.find({ownedBy: user})

        const settings = {
            apiKey: 'ELrNU9K6I9RNfXbIkJqq6H6NeoXNbF10',
            network: Network.ETH_MAINNET
          };

        var nfts = [];
        var nftsFinals = []

        const alchemy = new Alchemy(settings)
        var pageKey 
        do{
             var nftsIter = await alchemy.nft.getNftsForOwner(user.wallet, { excludeFilters: [NftFilters.AIRDROPS, NftFilters.SPAM],
                omitMetadata: false,
                orderBy: NftOrdering.TRANSFERTIME, pageKey: pageKey})
                for(const nft of nftsIter.ownedNfts){
                    if(nft.title.length && nft.contract.openSea && nft.contract.openSea.collectionName && nft.contract.openSea.imageUrl && nft.tokenType != NftTokenType.UNKNOWN && (nft.tokenType != NftTokenType.ERC1155 || 
                        nft.tokenType == NftTokenType.ERC1155 && (nft.contract.openSea.safelistRequestStatus == OpenSeaSafelistRequestStatus.VERIFIED || nft.contract.openSea.safelistRequestStatus == OpenSeaSafelistRequestStatus.APPROVED))){
                        nfts.push(nft)
                    }
                }
                if(nftsIter.pageKey) pageKey = nftsIter.pageKey 
                else pageKey = undefined
        } while(pageKey)
        var groupedBy = _.groupBy(nfts, "contract.address")
        for(const key in groupedBy){
            nftsFinals.push({ownedBy: user.id, title: groupedBy[key][0].contract.openSea.collectionName , images: groupedBy[key].map(e => e.media[0].thumbnail ?? e.media[0].gateway), collectionImage: groupedBy[key][0].contract.openSea.imageUrl, contractAddress: key, floorPrice: groupedBy[key][0].contract.openSea.floorPrice ?? 0})
        } 

        

        var toUpdate = nftsFinals.filter(e => res.some(({contractAddress, images}) => e.contractAddress == contractAddress && e.images.length != images.length))
        var toRemove = _.difference(res.map(e => e.contractAddress), nftsFinals.map(e => e.contractAddress))
        var toAdd = _.difference(nftsFinals.map(e => e.contractAddress), res.map(e => e.contractAddress))
        if(toUpdate.length > 0){
            for(const elementToUpdate of toUpdate){
                await this.nftModel.findOneAndUpdate({contractAddress: elementToUpdate.contractAddress}, {images: elementToUpdate.images}, { new: true, useFindAndModify: false })
            }
        }

        if(toRemove.length > 0){
            for(const elementToRemove of toRemove){
                await this.nftModel.findOneAndDelete({contractAddress: elementToRemove})
            }
        }

        if(toAdd.length > 0){
            for(const elementToAdd of toAdd){
                const nftToAdd = nftsFinals.filter(e => e.contractAddress === elementToAdd)[0]
                await new this.nftModel({ownedBy: nftToAdd.ownedBy, title: nftToAdd.title, images: nftToAdd.images, collectionImage: nftToAdd.collectionImage, contractAddress: nftToAdd.contractAddress, isFav: false, floorPrice: nftToAdd.floorPrice}).save()
            }
        }
    }

    async updateNFTStatus(data: NFTModificationDTO, user: User){
        let userToId;
        if(data.id === user.id) userToId = user
        else userToId = await this.userModel.findById(data.id)
        const nft = await this.nftModel.findOne({ownedBy: userToId, contractAddress: data.contractAddress})
        nft.isFav = data.isFav
        await nft.save()
        return formatToNFTInfoDTO(nft)
    }

    async getAllNFTs(user: User){
        const settings = {
            apiKey: 'ELrNU9K6I9RNfXbIkJqq6H6NeoXNbF10',
            network: Network.ETH_MAINNET
          };

          var nfts = [];
          var nftsFinals = []

        const alchemy = new Alchemy(settings)
        var pageKey 
        do{
             var nftsIter = await alchemy.nft.getNftsForOwner(user.wallet, { excludeFilters: [NftFilters.AIRDROPS, NftFilters.SPAM],
                omitMetadata: false,
                orderBy: NftOrdering.TRANSFERTIME, pageKey: pageKey})
                for(const nft of nftsIter.ownedNfts){
                    if(nft.title.length && nft.contract.openSea && nft.contract.openSea.collectionName && nft.contract.openSea.imageUrl && nft.tokenType != NftTokenType.UNKNOWN && (nft.tokenType != NftTokenType.ERC1155 || 
                        nft.tokenType == NftTokenType.ERC1155 && (nft.contract.openSea.safelistRequestStatus == OpenSeaSafelistRequestStatus.VERIFIED || nft.contract.openSea.safelistRequestStatus == OpenSeaSafelistRequestStatus.APPROVED))){
                        nfts.push(nft)
                    }
                }
                if(nftsIter.pageKey) pageKey = nftsIter.pageKey 
                else pageKey = undefined
        } while(pageKey)

     
        var groupedBy = _.groupBy(nfts, "contract.address")
        for(const key in groupedBy){
            nftsFinals.push({ownedBy: user.id, title: groupedBy[key][0].contract.openSea.collectionName , images: groupedBy[key].map(e => e.media[0].thumbnail ?? e.media[0].gateway), collectionImage: groupedBy[key][0].contract.openSea.imageUrl, contractAddress: key, floorPrice: groupedBy[key][0].contract.openSea.floorPrice ?? 0})
        }

        await this.createMultipleCollections(nftsFinals, user)

    }

}
