export declare class ApnsService {
    private fcm;
    pushNotifications(message: any): void;
    callInvitationApn(userCalling: any, channel: any, voipToken: any, userCalled: any, callId: any): void;
    callInvitationIOS(userCalling: any, channel: any, fcmToken: any, userCalled: any, callId: any): void;
    callInvitationAndroid(userCalling: any, channel: any, fcmToken: any, userCalled: any, callId: any): void;
    declineCallIOS(channelId: any, fcmToken: any): void;
    declineCallAndroid(channelId: any, fcmToken: any): void;
    missedCallIOS(user: any, fcmToken: any): void;
    missedCallAndroid(user: any, fcmToken: any): void;
    addedByUserIOS(user: any, fcmToken: any): void;
    addedByUserAndroid(user: any, fcmToken: any): void;
    userAddedInSirkl(user: any, fcmToken: any): void;
    sendNotificationToAllUsers(data: any, user: any): void;
    userAddedInGroupAndroid(user: any, fcmToken: any, groupId: any, body: any): void;
    userAddedInGroupIOS(user: any, fcmToken: any, groupId: any, body: any): void;
    userAddedAsAdminAndroid(user: any, fcmToken: any, groupName: any, groupId: any): void;
    userAddedAsAdminIOS(user: any, fcmToken: any, groupName: any, groupId: any): void;
    receiveRequestToJoinGroupIOS(user: any, fcmToken: any, groupName: any): void;
    receiveRequestToJoinGroupAndroid(user: any, fcmToken: any, groupName: any): void;
    userInvitedToJoinGroup(user: any, fcmToken: any, body: any, groupId: any): void;
}
