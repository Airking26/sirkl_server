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

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService){}

    async verifySignature(walletConnectDTO: WalletConnectDTO){
        const web3 = new Web3(Web3.givenProvider);
        const accountRecovered = web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature);
        if(walletConnectDTO.wallet.toLowerCase() == accountRecovered.toLowerCase()){
            const user = await this.userService.get_user_by_wallet(walletConnectDTO.wallet);
            if(!user){
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

    async queryEthAddressforENS(wallet: string){
        let result : GraphQLResponse = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', this.getQueryETHAddressForENS(wallet))
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
