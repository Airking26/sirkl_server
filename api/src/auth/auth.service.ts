import {Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/interface/interface.user';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './passport/interface/auth.passport.interface.jwt_payload';
import { formatToRefreshTokenDTO, formatToSignInSuccessDTO } from './response/response.sign_in';
import Web3 from "web3";
import { WalletConnectDTO } from './dto/dto.wallet-connect';
import { gql, request } from 'graphql-request'
import { GraphQLResponse } from 'graphql-request/build/esm/types';
import contractAbi from 'src/contract/abi.json'
import { AbiItem } from 'web3-utils'
import nacl from 'tweetnacl'
import { StreamChat } from 'stream-chat';
import { formatToUserDTO } from 'src/user/response/response.user';
import { ApnsService } from 'src/apns/apns.service';
import bs58 from 'bs58';



@Injectable()
export class AuthService {

    private web3: Web3

    constructor(
        private readonly apnService: ApnsService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService){
            this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.SKALE_RPC_URL));
        }

    async verifySignature(walletConnectDTO: WalletConnectDTO){

        //var  private_key = process.env.PRIVATE_KEY;
        //var contractAddress = process.env.SKALE_SMART_CONTRACT;
        //var wallet_to_send = walletConnectDTO.wallet;
        /*var isValidSignature = false;

        if(this.isEthereumAddress(walletConnectDTO.wallet)) {
            isValidSignature = this.web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature).toLowerCase() == walletConnectDTO.wallet.toLowerCase()
        } else {
            isValidSignature = this.verifySignatureSolana(walletConnectDTO.wallet, walletConnectDTO.message, walletConnectDTO.signature)
        }*/
        
        var isValidSignature = this.web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature).toLowerCase() == walletConnectDTO.wallet.toLowerCase()

        if(isValidSignature){
            const user = await this.userService.get_user_by_wallet(walletConnectDTO.wallet.toLowerCase());
            if(!user){
                /*try{
                    const ownerAccount = web3.eth.accounts.privateKeyToAccount(private_key);
                    web3.eth.accounts.wallet.add(ownerAccount);
                    const contract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress);
                    const functionData = await contract.methods.whitelist(wallet_to_send).encodeABI();
                    const txObject = {
                        from: ownerAccount.address,
                        to: contractAddress,
                        gas: 100000,
                        data: functionData,
                      };
                    web3.eth.sendTransaction(txObject);
                    } catch(error){
                        var y = error;
                    }
            
                const ens = await this.queryEthAddressforENS(walletConnectDTO.wallet)*/
                const user = await this.userService.createUserWithWallet(walletConnectDTO.wallet, undefined, walletConnectDTO.platform)
                const accessToken = await this.generate_jwt_token(user.wallet);
                const refreshToken = await this.generate_refresh_token(user.wallet);
                const res = await this.userService.update_refresh_token(refreshToken, user);
                //if(this.isEthereumAddress(walletConnectDTO.wallet)) this.handleMintProcess(user)
                return formatToSignInSuccessDTO(accessToken, refreshToken, res)
            } else {
                //if(!user.hasSBT) this.handleMintProcess(user);
                const accessToken = await this.generate_jwt_token(user.wallet)
                const refreshToken = await this.generate_refresh_token(user.wallet)
                const res = await this.userService.update_refresh_token(refreshToken, user)
                return formatToSignInSuccessDTO(accessToken, refreshToken, res)
            }
        }
    }

    isEthereumAddress(address: string): boolean {
        // Check if the address starts with '0x' and is a 42-character long hexadecimal string
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    isSolanaAddress(address: string): boolean {
        // Check if the address is a base58-encoded string with length between 43 and 44
        return /^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(address);
    }

    checkBetaCode(code: string){
        if(code == process.env.BETA_CODE) return true
        else return false
    }

    checkWalletIsUser(wallet: string){
        return this.userService.checkUserExists(wallet);
    }

    async queryEthAddressforENS(wallet: string){
        let result : GraphQLResponse = await request(process.env.THE_GRAPH_API, this.getQueryETHAddressForENS(wallet))
        return result?.domains ? result?.domains[0]?.name : "0";
    }

      getQueryETHAddressForENS(wallet: string){
        return gql`{
          domains(first: 1, where:{owner:"${wallet.toLowerCase()}"}) {
            name
          }
        }`
    }

    async validateUser(payload: JwtPayload) {
        return await this.userService.get_user_by_wallet(payload.wallet);
    }

    async signUserOut(user: User) {
        return this.userService.deleteRefreshToken(user);
    }

    private async generate_jwt_token(wallet) {
        const payload: JwtPayload = { wallet };
        return this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION, secret: process.env.JWT_AUTH_KEY });
    }

    private async generate_refresh_token(wallet) {
        const payload: JwtPayload = { wallet };
        return this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH, secret: process.env.JWT_REFRESH_KEY });
    }

    async handleRefreshToken(user: User) {
        await this.userService.changeUpdatedAt(user.wallet)
        const accessToken = await this.generate_jwt_token(user.wallet);
        return formatToRefreshTokenDTO(accessToken);
    }

    async test(){
        const wallet = "XrKQC6HJ4mEN9vLUjf1zZUFP279IVxp2ajofFmOH0jA=";
        const message = "Welcome to XrKQC6HJ4mEN9vLUjf1zZUFP279IVxp2ajofFmOH0jA= SIRKL.io by signing this message you agree to learn and have fun with blockchain"
        const payload = "/nuVyojRhzuYCSF5eqJcDGvCTNZsjkCH/kPUCz77y8jP5efm/mze/NDbBjoMYbG0GHEsrbXQNtpbeOpHKot1CQ=="

        //return this.verifySignatureSolana(wallet, message, payload)
    }

    verifySignatureSolana(walletAddress: string, message: string, signature: string): boolean {
        try {
            // Convert the wallet address (public key) from Base64 to Uint8Array
            const wallet = bs58.decode(walletAddress);

            // Decode the signature from Base64 to Uint8Array
            const signatureBuffer = Buffer.from(signature, 'base64');

            // Convert the message to Uint8Array (Buffer)
            const messageBuffer = Buffer.from(message);

            // Verify the signature using nacl
            return nacl.sign.detached.verify(messageBuffer, signatureBuffer, wallet);
        } catch (error) {
            console.error("Error verifying signature:", error);
            return false;
        }
    }


    async createUAW() {
        //this.mintTokenUsingTempWallet("0x1646c506d28ad06a89244c3ca241ed8fd20b6d9e4b958976c10f80c92c04a4fd", contractAbi, process.env.SKALE_SMART_CONTRACT)
        this.handleMintProcess("0xe91b6904f2Bd62b135E559882ddCeeF6Ae210a4B")
        /*const apiKey = process.env.STREAM_API_KEY
        const secret = process.env.STREAM_SECRET
        const serverClient = StreamChat.getInstance(apiKey, secret)
        var  private_key = process.env.PRIVATE_KEY;
        var contractAddress = process.env.SKALE_SMART_CONTRACT;
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.SKALE_RPC_URL));
        for (let i = 0; i <= 6; i++) {
        try{
            await this.waitRandomSeconds(3, 15);
            const newWallet = web3.eth.accounts.create();
            const user = await this.userService.createUserWithWallet(newWallet.address, undefined, "android")
            await serverClient.connectUser({id: user.id, name: user.userName ?? user.wallet, extraData: {'userDTO' : formatToUserDTO(user, user)}}, this.userService.generateStreamChatToken(user))
            const ownerAccount = web3.eth.accounts.privateKeyToAccount(private_key);
            web3.eth.accounts.wallet.add(ownerAccount);
            const contract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress);
            const functionData = await contract.methods.whitelist(newWallet.address).encodeABI();
            const txObject = {
                from: ownerAccount.address,
                to: contractAddress,
                gas: 100000,
                data: functionData,
              };
            await web3.eth.sendTransaction(txObject);
            try{
                web3.eth.accounts.wallet.add(newWallet)
                const mint = await contract.methods.mint().encodeABI();
                const txObject = {
                    from: newWallet.address,
                    to: contractAddress,
                    gas: 100000,
                    mint
                }
                await web3.eth.sendTransaction(txObject);
            } catch(error){
                var y = error;
            }
        } catch(error){
                var y = error;
        }
    }*/
    }

    waitRandomSeconds(minSeconds: number, maxSeconds: number): Promise<void> {
        // Ensure the min is not greater than max
        const min = Math.ceil(minSeconds);
        const max = Math.floor(maxSeconds);
        // Generate a random time between min and max seconds
        const timeToWait = Math.floor(Math.random() * (max - min + 1) + min) * 1000; // Convert seconds to milliseconds
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, timeToWait);
        });
      }

      async handleMintProcess(user) {
        try {

            var  ownerPrivateKey = process.env.PRIVATE_KEY;
            var contractAddress = process.env.SKALE_SMART_CONTRACT;

          // 1. Create a Temporary Wallet
          const tempAccount = this.web3.eth.accounts.create();
          console.log('Temporary Wallet Address:', tempAccount.address);
          //console.log('Private Key:', tempAccount.privateKey);
      
          // 2. Whitelist the Temporary Wallet
          await this.whitelistWallet(tempAccount.address, contractAbi, contractAddress, ownerPrivateKey);
          console.log('Temporary wallet whitelisted.');
      
          // 3. Mint the Token to the Temporary Wallet
          const mintReceipt = await this.mintTokenUsingTempWallet(tempAccount.privateKey, contractAbi, contractAddress);
          console.log('Token minted to temporary wallet.');
      
          // Assuming the tokenId is part of the receipt, otherwise, you may need to adjust this.
          const tokenId = await this.decodeMintEvent(mintReceipt, contractAbi as AbiItem[])

          // 4. Transfer the Token to the Real Wallet
          await this.transferTokenToRealWallet(tempAccount.privateKey, user.wallet, contractAbi as AbiItem[], contractAddress, 0);
          console.log('Token transferred to real wallet.');
      
          // 5. Verify the Transfer
          const newOwner = await this.checkTokenOwner(contractAbi, contractAddress, tokenId);
          console.log(`Token ID ${tokenId} is now owned by ${newOwner}.`);
          if(user.wallet.toLowerCase() == newOwner.toLowerCase()){
            await this.userService.updateUserInfos({hasSBT: true}, user)
            await this.userService.addToSirklClub(user)
            await this.apnService.sendMintNotificationSucceed(user.fcmTokens.map(it => it.token));
          }
      
        } catch (error) {
          console.error('Error during the minting process:', error);
        }
      }


      async whitelistWallet(tempWalletAddress: string, contractAbi: any, contractAddress: string, ownerPrivateKey: string) {
    
        const ownerAccount = this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey);
       this.web3.eth.accounts.wallet.add(ownerAccount);
      
        const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
        const functionData = await contract.methods.whitelist(tempWalletAddress).encodeABI();
      
        const estimatedGas = await contract.methods.whitelist(tempWalletAddress).estimateGas({ from: ownerAccount.address });

        // Prepare the base transaction object without the gas property
        const txObject: any = {
            from: ownerAccount.address,
            to: contractAddress,
            data: functionData,
            gas: estimatedGas
        };
  
        // Send the transaction
        return await this.web3.eth.sendTransaction(txObject);
    }

    
    async  mintTokenUsingTempWallet(tempPrivateKey: string, contractAbi: any, contractAddress: string): Promise<any> {
        const tempAccount = this.web3.eth.accounts.privateKeyToAccount(tempPrivateKey);
        this.web3.eth.accounts.wallet.add(tempAccount);
    
        const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    
        // Estimate gas required for the mint transaction
        const estimatedGas = await contract.methods.mint().estimateGas({ from: tempAccount.address });
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasCost = BigInt(estimatedGas) * BigInt(gasPrice);
    
        // Check if the wallet has enough balance
        const balance = await this.web3.eth.getBalance(tempAccount.address);
    
        if (BigInt(balance) < gasCost) {
            throw new Error('Insufficient funds in the temporary wallet to cover gas fees.');
        }
    
        const functionData = await contract.methods.mint().encodeABI();
      
        const txObject = {
            from: tempAccount.address,
            to: contractAddress,
            gas: estimatedGas,
            gasPrice: gasPrice,
            data: functionData,
        };
    
        // Send the transaction
        return await this.web3.eth.sendTransaction(txObject);
    }
    
    async  transferTokenToRealWallet(tempPrivateKey: string, realWalletAddress: string, contractAbi: AbiItem[], contractAddress: string, tokenId: number) {
        const tempAccount = this.web3.eth.accounts.privateKeyToAccount(tempPrivateKey);
        this.web3.eth.accounts.wallet.add(tempAccount);
        
        const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    
        // Estimate the gas required for the transaction
        const estimatedGas = await contract.methods.safeTransferFrom(tempAccount.address, realWalletAddress, 0, 1, '0x').estimateGas({ from: tempAccount.address });
    
        // Prepare the transaction data
        const functionData = contract.methods.safeTransferFrom(tempAccount.address, realWalletAddress, 0, 1, '0x').encodeABI();
        
        // Prepare the transaction object
        const txObject = {
            from: tempAccount.address,
            to: contractAddress,
            gas: estimatedGas,
            data: functionData,
        };
        
        // Send the transaction
        return await this.web3.eth.sendTransaction(txObject);
    }

    
    async checkTokenOwner(contractAbi, contractAddress, tokenId) {
        const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
        return await contract.methods.ownerOf(tokenId).call();
      }

      async decodeMintEvent(mintReceipt: any, contractAbi: AbiItem[]) {
        // The event signature for "Mint(address,uint256)" - this should match the event in your contract
        const mintEventSignature = this.web3.eth.abi.encodeEventSignature('Mint(address,uint256)');
    
        // Find the log that matches the Mint event signature
        const mintLog = mintReceipt.logs.find((log: any) => log.topics[0] === mintEventSignature);
    
        if (!mintLog) {
            throw new Error('Mint event not found in the transaction logs.');
        }
    
        // Decode the event log
        const decodedLog = this.web3.eth.abi.decodeLog(
            [
                { type: 'address', name: 'to', indexed: true },
                { type: 'uint256', name: 'tokenId' }
            ],
            mintLog.data,
            mintLog.topics.slice(1)
        );
    
        console.log(`Token minted to address: ${decodedLog.to}`);
        console.log(`Token ID: ${decodedLog.tokenId}`);
    
        return decodedLog.tokenId;
    }


    

}
