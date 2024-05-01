export interface Notification {
    hasBeenRead: boolean;
    createdAt: Date;
    type: number;
    id: string;
    idData: string;
    picture: string;
    belongTo: string;
    username: string;
    eventName: string;
    message: string;
    channelId: string;
    channelName: string;
    requester: string;
    paying: boolean;
    inviteId: string;
    channelPrice: string;
}
