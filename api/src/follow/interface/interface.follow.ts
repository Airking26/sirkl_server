import { User } from "src/user/interface/interface.user";

export interface Follow {
    createdAt: Date;
    updatedAt: Date;
    requester: User;
    recipient: User;
}
