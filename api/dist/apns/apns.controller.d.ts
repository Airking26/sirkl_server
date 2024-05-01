import { ApnsService } from "./apns.service";
import { NotificationToAllDTO } from "./dto/dto.notification_to_all";
export declare class ApnsController {
    private apnService;
    constructor(apnService: ApnsService);
    sendNotificationToAllUsers(notificationToAllDTO: NotificationToAllDTO, request: any): void;
}
