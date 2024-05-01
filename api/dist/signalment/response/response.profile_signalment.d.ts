import { User } from "src/user/interface/interface.user";
import { UserInfoDTO } from "src/user/response/response.user";
import { ProfileSignalement } from "../interface/interface.profile_signalment";
export declare class ProfileSignalmentInfoDTO {
    readonly id: string;
    readonly createdBy: UserInfoDTO;
    readonly idSignaled: string;
    readonly type: number;
    readonly description: string;
    readonly createdAt: Date;
}
export declare function formatToProfileSignalmentDTO(data: ProfileSignalement, user: User): ProfileSignalmentInfoDTO;
