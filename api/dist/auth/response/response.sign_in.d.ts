import { User } from "src/user/interface/interface.user";
import { UserInfoDTO } from "src/user/response/response.user";
export declare class SignInSuccessDTO {
    user: UserInfoDTO;
    accessToken: string;
    refreshToken: string;
}
export declare function formatToSignInSuccessDTO(accessToken: string, refreshToken: any, user: User): SignInSuccessDTO;
export declare class RefreshTokenDTO {
    accessToken: string;
}
export declare function formatToRefreshTokenDTO(accessToken: string): RefreshTokenDTO;
