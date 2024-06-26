import { FCMToken } from "src/apns/interface/interface.fcm-tokens";
export interface User {
    id: string;
    userName: string;
    picture: string;
    fcmTokens: FCMToken[];
    isAdmin: boolean;
    createdAt: Date;
    description: string;
    fcmToken: string;
    nicknames: Map<String, String>;
    wallet: string;
    following: User[];
    apnToken: string;
    updatedAt: Date;
    platformCreated: string;
    platformUpdated: string;
    hasSBT: boolean;
}
