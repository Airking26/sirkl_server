import { NotificationService } from './notification.service';
import { NotificationInfoDTO } from './response/response.notification';
import { NotificationToAllDTO } from 'src/apns/dto/dto.notification_to_all';
import { NotificationAddedOrAdmin } from 'src/apns/dto/dto.notification_added_in_group';
export declare class NotificationController {
    private commentService;
    constructor(commentService: NotificationService);
    getNotifications(offset: string, id: any, request: any): Promise<NotificationInfoDTO[]>;
    deleteNotification(id: string, request: any): Promise<import("./interface/interface.notification").Notification & import("mongoose").Document<any, any>>;
    checkUnreadNotification(id: string, request: any): Promise<boolean>;
    registerNotification(request: any, notif: NotificationToAllDTO): Promise<void>;
    notifyAddedInGroup(request: any, naoa: NotificationAddedOrAdmin): Promise<void>;
    notifyUserAsAdmin(request: any, naoa: NotificationAddedOrAdmin): Promise<void>;
    notifyUserInvitedToJoinPayingGroup(request: any, naoa: NotificationAddedOrAdmin): Promise<void>;
}
