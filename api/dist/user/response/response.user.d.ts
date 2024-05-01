import { User } from "../interface/interface.user";
export declare class UserInfoDTO {
    readonly id: string;
    readonly userName: string;
    readonly picture: string;
    readonly isAdmin: boolean;
    readonly createdAt: Date;
    readonly description: string;
    readonly fcmToken: string;
    readonly wallet: string;
    readonly following: number;
    readonly isInFollowing: boolean;
    readonly nickname: string;
    readonly apnToken: string;
    readonly updatedAt: Date;
    readonly platformCreated: string;
    readonly platformUpdated: string;
    readonly hasSBT: boolean;
}
export declare class LatestUserDTO {
    from: Date;
    to: Date;
    param: number;
    name: string;
}
export declare class UsersCountDTO {
    readonly count: number;
    readonly users: UserInfoDTO[];
}
export declare function formatToUserDTO(user: User, ref: any): UserInfoDTO;
export declare function formatMultipleUsersDTO(users: User[], user?: User): UserInfoDTO[];
export declare function formatToUsersCountDTO(usersSearchedAccount: number, users: User[], user: User): UsersCountDTO;
export declare function formatLatestUserCountDTO(from: Date, to: Date, count: number): {
    from: Date;
    to: Date;
    count: number;
};
