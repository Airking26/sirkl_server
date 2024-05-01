import { Model } from 'mongoose';
import { User } from "../user/interface/interface.user";
import { ApnsService } from 'src/apns/apns.service';
import { Join } from './interface/interface.request';
export declare class JoinService {
    private readonly userModel;
    private readonly requestModel;
    private readonly notificationModel;
    private readonly apnsService;
    constructor(userModel: Model<User>, requestModel: Model<Join>, notificationModel: Model<Notification>, apnsService: ApnsService);
    createRequestToJoinPrivateGroup(data: any, user: any): Promise<Join & import("mongoose").Document<any, any>>;
    retrieveRequests(channelId: any, user: any): Promise<import("src/user/response/response.user").UserInfoDTO[]>;
    acceptDeclineRequest(data: any, me: any): Promise<void>;
}
