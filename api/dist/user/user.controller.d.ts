/// <reference types="mongoose" />
import { UpdateFcmDTO } from "./dto/dto.update_fcm";
import { UpdateUserInfoDTO } from "./dto/dto.update_user";
import { LatestUserDTO, UserInfoDTO, UsersCountDTO } from "./response/response.user";
import { UserService } from "./user.service";
import { AdminUserGetStream } from "./dto/dto.admin";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUser(request: any): Promise<UserInfoDTO>;
    updateUser(request: any, data: UpdateUserInfoDTO): Promise<UserInfoDTO>;
    connecToWS(request: any): Promise<void>;
    deleteUser(id: string, request: any): Promise<import("./interface/interface.user").User & import("mongoose").Document<any, any>>;
    getUser(id: string, request: any): Promise<UserInfoDTO>;
    updateFCMToken(request: any, data: UpdateFcmDTO): Promise<UserInfoDTO>;
    updateAPNToken(request: any, apn: string): Promise<UserInfoDTO>;
    retrieveUserByWallet(wallet: string, request: any): Promise<UserInfoDTO>;
    retrieveStreamChatToken(request: any): string;
    connectToGetStream(request: any): Promise<void | import("stream-chat").ConnectionOpen<import("stream-chat").DefaultGenerics>>;
    changeAdminRole(adminUserGetStream: AdminUserGetStream, request: any): Promise<void>;
    getWelcomingMessage(request: any): Promise<void>;
    retrieveAgoraTokenRTC(request: any, channel: string, role: string, tokenType: string, uid: string): Promise<any>;
    getNewUsersBetweenDates(offset: string, body: LatestUserDTO, request: any): Promise<UsersCountDTO>;
    getActiveUsersBetweenDates(offset: string, body: LatestUserDTO, request: any): Promise<UsersCountDTO>;
    getNewUsersCountBetweenDates(body: LatestUserDTO, request: any): Promise<{
        from: Date;
        to: Date;
        count: number;
    }>;
}
