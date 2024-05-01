import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../interface/interface.user";

export class UserInfoDTO{
    @ApiProperty({type: String})
    readonly id: string;

    @ApiProperty({type: String})
    readonly userName: string;

    @ApiProperty({type: String})
    readonly picture: string;

    @ApiProperty({type: Boolean})
    readonly isAdmin: boolean

    @ApiProperty({type: Date})
    readonly createdAt: Date

    @ApiProperty({type: String})
    readonly description: string

    @ApiProperty({type: String})
    readonly fcmToken: string

    @ApiProperty({type: String})
    readonly wallet: string

    @ApiProperty({type: Number})
    readonly following: number;

    @ApiProperty({type: Boolean})
    readonly isInFollowing: boolean;

    @ApiProperty({type: String})
    readonly nickname : string

    @ApiProperty({type: String})
    readonly apnToken: string

    @ApiProperty({type: Date})
    readonly updatedAt : Date

    @ApiProperty({type: String})
    readonly platformCreated: string

    @ApiProperty({type: String})
    readonly platformUpdated: string

    @ApiProperty({type: Boolean})
    readonly hasSBT: boolean
}

export class LatestUserDTO {
    @ApiProperty({type: Date})
    @IsNotEmpty()
    @IsDateString()
    from: Date;

    @ApiProperty({type: Date})
    @IsNotEmpty()
    @IsDateString()
    to: Date;

    @ApiProperty({type: Number})
    @IsNotEmpty()
    @IsNumber()
    param : number

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    name: string
}

export class UsersCountDTO {
    @ApiProperty({type: Number})
    readonly count: number;

    @ApiProperty({type: UserInfoDTO, isArray: true})
    readonly users: UserInfoDTO[];
}

export function formatToUserDTO(user: User, ref): UserInfoDTO{
    const {id, userName, picture, isAdmin, createdAt, description, fcmToken, wallet, following, apnToken, updatedAt, platformCreated, platformUpdated, hasSBT} = user
    const isInFollowing = ref ? ref.following.includes(id) : undefined;
    const nickname = ref ? ref.nicknames.get(wallet) : undefined;

    return{
        id,
        userName,
        picture,
        isAdmin,
        createdAt,
        description,
        fcmToken,
        nickname,
        wallet,
        apnToken,
        following: following.length,
        isInFollowing: isInFollowing,
        updatedAt,
        platformCreated,
        platformUpdated,
        hasSBT
    }
}

export function formatMultipleUsersDTO(users: User[], user?: User): UserInfoDTO[] {
    return  users.map(it => formatToUserDTO(it, user));
}

export function formatToUsersCountDTO(usersSearchedAccount: number, users: User[], user: User): UsersCountDTO{
    return {count: usersSearchedAccount, users: formatMultipleUsersDTO(users, user)};
}

export function formatLatestUserCountDTO(from: Date, to: Date, count: number) {
    return {
        from, to, count
    };
}