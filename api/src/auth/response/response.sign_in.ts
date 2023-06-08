import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO, UserInfoDTO } from "src/user/response/response.user";

export class SignInSuccessDTO {
    @ApiProperty({type: UserInfoDTO})
    user: UserInfoDTO;
    @ApiProperty({type: String})
    accessToken: string;
    @ApiProperty({type: String})
    refreshToken: string;
}

export function formatToSignInSuccessDTO(accessToken: string, refreshToken, user: User): SignInSuccessDTO {
    return { user: formatToUserDTO(user, user), accessToken, refreshToken};
}

export class RefreshTokenDTO {
    @ApiProperty({type: String})
    accessToken: string
}

export function formatToRefreshTokenDTO(accessToken: string): RefreshTokenDTO {
    return { accessToken }
}
