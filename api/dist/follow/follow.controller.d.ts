import { UserInfoDTO } from "src/user/response/response.user";
import { FollowService } from "./follow.service";
export declare class FollowController {
    private followService;
    constructor(followService: FollowService);
    followUser(id: string, request: any): Promise<UserInfoDTO>;
    unfollowUser(id: string, request: any): Promise<UserInfoDTO>;
    getFollowingUsers(id: any, request: any): Promise<UserInfoDTO[]>;
    searchInFollowing(offset: any, name: any, request: any): Promise<UserInfoDTO[]>;
    checkUserIsInFollowing(userID: any, request: any): Promise<any>;
}
