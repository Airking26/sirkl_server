import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/interface/interface.user';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './passport/interface/auth.passport.interface.jwt_payload';
import { WalletConnectDTO } from './dto/dto.wallet-connect';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    testing(): Promise<any>;
    verifySignature(walletConnectDTO: WalletConnectDTO): Promise<import("./response/response.sign_in").SignInSuccessDTO>;
    checkBetaCode(code: string): boolean;
    createUAW(): Promise<void>;
    waitRandomSeconds(minSeconds: number, maxSeconds: number): Promise<void>;
    queryEthAddressforENS(wallet: string): Promise<any>;
    getQueryETHAddressForENS(wallet: string): string;
    createWalletOnTheFly(): Promise<void>;
    validateUser(payload: JwtPayload): Promise<User>;
    isUserExists(wallet: string): Promise<boolean>;
    private static compareHash;
    signUserOut(user: User): Promise<import("../user/response/response.user").UserInfoDTO>;
    private generate_jwt_token;
    private generate_refresh_token;
    handleRefreshToken(user: User): Promise<import("./response/response.sign_in").RefreshTokenDTO>;
}
