import { UserInfoDTO } from 'src/user/response/response.user';
import { AuthService } from './auth.service';
import { WalletConnectDTO } from './dto/dto.wallet-connect';
import { RefreshTokenDTO, SignInSuccessDTO } from './response/response.sign_in';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    refreshAccessToken(request: any): Promise<RefreshTokenDTO>;
    createUAW(): Promise<void>;
    logOut(request: any): Promise<UserInfoDTO>;
    verifySignature(walletConnectDTO: WalletConnectDTO): Promise<SignInSuccessDTO>;
    createWalletOnTheFly(): Promise<void>;
}
