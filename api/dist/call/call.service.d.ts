import { Model } from "mongoose";
import { ApnsService } from "src/apns/apns.service";
import { Nicknames } from "src/nicknames/interface/interface.nicknames";
import { User } from "src/user/interface/interface.user";
import { CallCreationDTO, CallModificationDTO } from "./dto/dto.call";
import { Call } from "./interface/interface.call";
export declare class CallService {
    private readonly callModel;
    private readonly userModel;
    private readonly nicknamesModel;
    private readonly apnsService;
    constructor(callModel: Model<Call>, userModel: Model<User>, nicknamesModel: Model<Nicknames>, apnsService: ApnsService);
    sendCallInvitationNotification(user: any, channel: any, userID: any, callId: any): Promise<User & import("mongoose").Document<any, any>>;
    retrieveCalls(user: User, offset: any): Promise<{
        id: string;
        called: import("../user/response/response.user").UserInfoDTO;
        updatedAt: Date;
        status: number;
    }[]>;
    createCall(data: CallCreationDTO, user: User): Promise<{
        id: string;
        called: import("../user/response/response.user").UserInfoDTO;
        updatedAt: Date;
        status: number;
    }>;
    updateCallStatus(data: CallModificationDTO, user: User): Promise<{
        id: string;
        called: import("../user/response/response.user").UserInfoDTO;
        updatedAt: Date;
        status: number;
    }>;
    missedCall(userId: String, user: User): Promise<void>;
    endACall(channelId: String, user: User, userID: String): Promise<void>;
    searchCalls(substring: string, user: User): Promise<{
        id: string;
        called: import("../user/response/response.user").UserInfoDTO;
        updatedAt: Date;
        status: number;
    }[]>;
    getByValue(map: Map<String, String>, searchValue: string): string;
}
