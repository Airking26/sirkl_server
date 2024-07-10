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


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService){}


    async verifySignature(walletConnectDTO: WalletConnectDTO){
        var  private_key = process.env.PRIVATE_KEY;
        var contractAddress = process.env.SKALE_SMART_CONTRACT;
        var wallet_to_send = walletConnectDTO.wallet;
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.SKALE_RPC_URL));
        var k =walletConnectDTO.wallet.toLowerCase() == web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature).toLowerCase();
        
        const accountRecovered = web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature);
        if(walletConnectDTO.wallet.toLowerCase() == accountRecovered.toLowerCase()){
            const user = await this.userService.get_user_by_wallet(walletConnectDTO.wallet);
            if(!user){
                try{
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
            
               const ens = await this.queryEthAddressforENS(walletConnectDTO.wallet)
                const user = await this.userService.createUserWithWallet(walletConnectDTO.wallet, ens, walletConnectDTO.platform)
                const accessToken = await this.generate_jwt_token(user.wallet);
                const refreshToken = await this.generate_refresh_token(user.wallet);
                const res = await this.userService.update_refresh_token(refreshToken, user);
                return formatToSignInSuccessDTO(accessToken, refreshToken, res)
            } else {
                const accessToken = await this.generate_jwt_token(user.wallet)
                const refreshToken = await this.generate_refresh_token(user.wallet)
                const res = await this.userService.update_refresh_token(refreshToken, user)
                return formatToSignInSuccessDTO(accessToken, refreshToken, res)
            }
        }
    }

    checkBetaCode(code: string){
        if(code == process.env.BETA_CODE) return true
        else return false
    }


    async createUAW() {
        var  private_key = process.env.PRIVATE_KEY;
        var contractAddress = process.env.SKALE_SMART_CONTRACT;
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.SKALE_RPC_URL));
        for (let i = 0; i <= 2; i++) {
        try{
            await this.waitRandomSeconds(3, 15);
            const newWallet = web3.eth.accounts.create();
            await this.userService.createUserWithWallet(newWallet.address, undefined, "android")
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
    }
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

    async createWalletOnTheFly(){
        const web3 = new Web3(Web3.givenProvider)
       console.log("")
    }

    async validateUser(payload: JwtPayload) {
        return await this.userService.get_user_by_wallet(payload.wallet);
    }

    async isUserExists(wallet: string){
        const user = await this.userService.get_user_by_wallet(wallet);
        return !user
    }

    private static compareHash(password: string, hash: string) {
        return password === hash;
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
}
