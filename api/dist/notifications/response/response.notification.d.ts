import { User } from "src/user/interface/interface.user";
import { Notification } from "../interface/interface.notification";
export declare class NotificationInfoDTO {
    readonly id: string;
    readonly createdAt: Date;
    readonly hasBeenRead: boolean;
    readonly picture: string;
    readonly type: number;
    readonly belongTo: string;
    readonly username: string;
    readonly idData: string;
    readonly eventName: string;
    readonly message: string;
    readonly channelId: string;
    readonly channelName: string;
    readonly requester: string;
    readonly paying: boolean;
    readonly inviteId: string;
    readonly channelPrice: string;
}
export declare function formatToNotificationInfoDTO(notification: Notification, user: User): NotificationInfoDTO;
export declare function formatMulitpleNotificationInfoDTO(notifications: Notification[], user: User): NotificationInfoDTO[];
export declare class NotificationResultDTO {
    readonly notifications: NotificationInfoDTO[];
}
