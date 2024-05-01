import { Model } from 'mongoose';
import { User } from "src/user/interface/interface.user";
import { Notification } from "./interface/interface.notification";
import { ApnsService } from "src/apns/apns.service";
export declare class NotificationService {
    private readonly notificationModel;
    private readonly userModel;
    private readonly apnsService;
    constructor(notificationModel: Model<Notification>, userModel: Model<User>, apnsService: ApnsService);
    showNotifications(belongTo: string, user: User, offset: any): Promise<import("./response/response.notification").NotificationInfoDTO[]>;
    removeNotification(idNotification: string): Promise<Notification & import("mongoose").Document<any, any>>;
    hasNotifUnread(belongTo: string, user: User): Promise<boolean>;
    registerNotification(user: any, data: any): Promise<void>;
    notifyUserAddedInGroup(me: any, data: any): Promise<void>;
    notifyUserAsAdmin(me: any, data: any): Promise<void>;
    notifyUserInvitedToJoinGroup(me: any, data: any): Promise<void>;
}
