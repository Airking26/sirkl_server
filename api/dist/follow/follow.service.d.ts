import { Model } from 'mongoose';
import { Follow } from "./interface/interface.follow";
import { User } from "../user/interface/interface.user";
import { ApnsService } from 'src/apns/apns.service';
export declare class FollowService {
    private readonly userModel;
    private readonly followModel;
    private readonly notificationModel;
    private readonly apnsService;
    constructor(userModel: Model<User>, followModel: Model<Follow>, notificationModel: Model<Notification>, apnsService: ApnsService);
    follow(user: User, userId: string): Promise<import("../user/response/response.user").UserInfoDTO>;
    unfollow(user: User, userId: string): Promise<import("../user/response/response.user").UserInfoDTO>;
    showFollowingUsers(userID: string, user: User): Promise<import("../user/response/response.user").UserInfoDTO[]>;
    isInFollowing(userID: string, user: any): Promise<any>;
    searchInFollowing(user: User, name: string, offset: number): Promise<import("../user/response/response.user").UserInfoDTO[]>;
}
