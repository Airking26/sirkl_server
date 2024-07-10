import { UserInfoDTO } from "src/user/response/response.user";
import { JoinService } from "./request.service";
import { JoinDTO } from "./dto/dto.request";
export declare class JoinController {
    private joinService;
    constructor(joinService: JoinService);
    notifyAddedInGroup(request: any, joinDTO: JoinDTO): Promise<import("./interface/interface.request").Join & import("mongoose").Document<any, any>>;
    getFollowingUsers(channelId: any, request: any): Promise<UserInfoDTO[]>;
    acceptOrDeclineRequest(request: any, joinDTO: JoinDTO): Promise<void>;
}
