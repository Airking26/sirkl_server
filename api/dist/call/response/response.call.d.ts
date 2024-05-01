import { User } from "src/user/interface/interface.user";
import { Call } from "src/call/interface/interface.call";
import { UserInfoDTO } from "src/user/response/response.user";
export declare class CallDTO {
    readonly id: string;
    readonly called: UserInfoDTO;
    readonly updatedAt: Date;
    readonly status: number;
}
export declare function formatToCallDTO(data: Call, user: User): {
    id: string;
    called: UserInfoDTO;
    updatedAt: Date;
    status: number;
};
export declare function formatMultipleCallDTO(data: Call[], user: User): {
    id: string;
    called: UserInfoDTO;
    updatedAt: Date;
    status: number;
}[];
