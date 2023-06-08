import { User } from "src/user/interface/interface.user";

export interface Join {
    createdAt: Date;
    updatedAt: Date;
    requester: User;
    receiver: User;
    channelId: String;
    channelName: String
}
