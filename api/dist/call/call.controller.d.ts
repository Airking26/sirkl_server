import { UserInfoDTO } from "src/user/response/response.user";
import { CallService } from "./call.service";
import { CallCreationDTO, CallModificationDTO } from "./dto/dto.call";
export declare class CallController {
    private readonly callService;
    constructor(callService: CallService);
    followUser(id: string, channel: string, request: any): Promise<void>;
    missedCallNotification(id: string, request: any): Promise<void>;
    createInbox(callCreationDTO: CallCreationDTO, request: any): Promise<{
        id: string;
        called: UserInfoDTO;
        updatedAt: Date;
        status: number;
    }>;
    updateUser(request: any, data: CallModificationDTO): Promise<{
        id: string;
        called: UserInfoDTO;
        updatedAt: Date;
        status: number;
    }>;
    retrieveInboxes(offset: any, request: any): Promise<{
        id: string;
        called: UserInfoDTO;
        updatedAt: Date;
        status: number;
    }[]>;
    searchUser(name: any, request: any): Promise<{
        id: string;
        called: UserInfoDTO;
        updatedAt: Date;
        status: number;
    }[]>;
}
