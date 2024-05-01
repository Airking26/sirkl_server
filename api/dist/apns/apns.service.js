"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApnsService = void 0;
const common_1 = require("@nestjs/common");
const fcm_node_1 = __importDefault(require("fcm-node"));
const apn_1 = __importDefault(require("apn"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
let ApnsService = class ApnsService {
    constructor() {
        this.fcm = new fcm_node_1.default(process.env.FIREBASE_SERVER_KEY);
    }
    pushNotifications(message) {
        const requests = message.map((m) => this.fcm.send(m, (err, response) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(response);
            }
        }));
    }
    callInvitationApn(userCalling, channel, voipToken, userCalled, callId) {
        const title = "Call Incoming";
        const body = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you';
        const pic = userCalling.picture;
        let provider = new apn_1.default.Provider({
            token: {
                key: path_1.default.join(__dirname, "..", "..", "certs", "AuthKey_SC5SCPP57W.p8"),
                keyId: "SC5SCPP57W",
                teamId: "5H8SVPW79X",
            },
            production: true
        });
        const id = (0, uuid_1.v4)();
        const uuid = (0, uuid_1.v4)();
        let notification = new apn_1.default.Notification();
        notification.rawPayload = {
            aps: {
                alert: {
                    title: title,
                    body: body,
                },
                mutableContent: true,
                contentAvailable: true,
                apnsPushType: "background"
            },
            handle: body,
            pic: pic,
            called_id: userCalled,
            call_id: callId,
            type: "voip",
            caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
            caller_id: userCalling.id,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            channel: channel,
            uuid: uuid,
            id: id,
        };
        console.log("id : " + id);
        console.log("uuid : " + uuid);
        notification.topic = "io.airking.sirkl.voip";
        notification.priority = 5;
        provider.send(notification, voipToken).then((res) => {
            if (res.failed)
                return console.log(JSON.stringify(res.failed));
            return console.log(JSON.stringify(res.sent));
        });
    }
    callInvitationIOS(userCalling, channel, fcmToken, userCalled, callId) {
        const uuid = (0, uuid_1.v4)();
        const body = "Call Incoming";
        const title = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you';
        const pic = userCalling.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title,
                    body,
                    call_id: callId,
                    called_id: userCalled,
                    caller_id: userCalling.id,
                    caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
                    pic: pic,
                    uuid: uuid,
                    channel: channel,
                },
                data: {
                    title,
                    body,
                    call_id: callId,
                    called_id: userCalled,
                    caller_id: userCalling.id,
                    caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
                    pic: pic,
                    uuid: uuid,
                    channel: channel,
                }
            };
        });
        this.pushNotifications(message);
    }
    callInvitationAndroid(userCalling, channel, fcmToken, userCalled, callId) {
        const uuid = (0, uuid_1.v4)();
        const body = "Call Incoming";
        const title = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you';
        const pic = userCalling.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {},
                data: {
                    title,
                    body,
                    type: 8,
                    call_id: callId,
                    called_id: userCalled,
                    caller_id: userCalling.id,
                    caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
                    pic: pic,
                    uuid: uuid,
                    channel: channel,
                },
                "priority": 10,
                "android": {
                    "priority": "high"
                },
                "webpush": {
                    "headers": {
                        "Urgency": "high"
                    }
                },
            };
        });
        this.pushNotifications(message);
    }
    declineCallIOS(channelId, fcmToken) {
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: "",
                    body: "",
                    type: 2,
                    channel_id: channelId
                },
                data: {
                    title: "Sirkl",
                    body: "Call ended",
                    type: 2,
                    channel_id: channelId
                }
            };
        });
        this.pushNotifications(message);
    }
    declineCallAndroid(channelId, fcmToken) {
        const message = fcmToken.map((token) => {
            return {
                to: token,
                data: {
                    title: "Sirkl",
                    body: "Call ended",
                    type: 2,
                    channel_id: channelId
                },
                "priority": 10,
                "android": {
                    "priority": "high"
                },
                "webpush": {
                    "headers": {
                        "Urgency": "high"
                    }
                },
            };
        });
        this.pushNotifications(message);
    }
    missedCallIOS(user, fcmToken) {
        const title = "Missed call";
        const body = user.userName != "" ? user.userName + " tried to call you" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " tried to call you";
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title,
                    body,
                    type: 3,
                },
                data: {
                    title,
                    body,
                    type: 3,
                }
            };
        });
        this.pushNotifications(message);
    }
    missedCallAndroid(user, fcmToken) {
        const title = "Missed call";
        const body = user.userName != "" ? user.userName + " tried to call you" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " tried to call you";
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title,
                    body,
                    type: 3,
                },
                data: {
                    title,
                    body,
                    type: 3,
                }
            };
        });
        this.pushNotifications(message);
    }
    addedByUserIOS(user, fcmToken) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " added you in his SIRKL" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " added you in his SIRKL";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 0,
                    username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 0,
                    username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
    addedByUserAndroid(user, fcmToken) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " added you in his SIRKL" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " added you in his SIRKL";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 0,
                    username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 0,
                    username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                }
            };
        });
        this.pushNotifications(message);
    }
    userAddedInSirkl(user, fcmToken) {
        const title = "Sirkl";
        const body = +"You have added " + user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " in your SIRKL";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            var _a;
            return {
                to: token,
                notification: {},
                data: {
                    title: title,
                    body: body,
                    type: 1,
                    username: (_a = user.userName == "") !== null && _a !== void 0 ? _a : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
    sendNotificationToAllUsers(data, user) {
        if (!user.isAdmin)
            throw new common_1.BadRequestException("USER_NOT_ADMIN");
        const title = "SIRKL.io";
        const body = data.message;
        const message = {
            to: "/topics/all",
            'data': {
                'title': title,
                'body': body,
                'type': 4,
                'id': "63f78a6188f7d4001f68699a",
                'picture': "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png"
            },
            "priority": 10,
            "android": {
                "priority": "high"
            },
            "webpush": {
                "headers": {
                    "Urgency": "high"
                }
            },
            'notification': {
                'title': title,
                'body': body,
                'type': 4,
                'id': "63f78a6188f7d4001f68699a",
                'picture': "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png"
            }
        };
        this.fcm.send(message, (err, response) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(response);
            }
        });
    }
    userAddedInGroupAndroid(user, fcmToken, groupId, body) {
        const title = "Sirkl";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 5,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 5,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                }
            };
        });
        this.pushNotifications(message);
    }
    userAddedInGroupIOS(user, fcmToken, groupId, body) {
        const title = "Sirkl";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 5,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 5,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
    userAddedAsAdminAndroid(user, fcmToken, groupName, groupId) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " upgraded you as admin in group " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " upgraded you as admin in group " + groupName;
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 6,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 6,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                }
            };
        });
        this.pushNotifications(message);
    }
    userAddedAsAdminIOS(user, fcmToken, groupName, groupId) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " upgraded you as admin in group " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " upgraded you as admin in group " + groupName;
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 6,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 6,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
    receiveRequestToJoinGroupIOS(user, fcmToken, groupName) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " has requested to join " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + groupName;
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 7,
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 7,
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
    receiveRequestToJoinGroupAndroid(user, fcmToken, groupName) {
        const title = "Sirkl";
        const body = user.userName != "" ? user.userName + " has requested to join " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + groupName;
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 7,
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 7,
                    id: user.id,
                    picture: pic,
                    fcmToken: fcmToken,
                }
            };
        });
        this.pushNotifications(message);
    }
    userInvitedToJoinGroup(user, fcmToken, body, groupId) {
        const title = "Sirkl";
        const pic = user.picture;
        const message = fcmToken.map((token) => {
            return {
                to: token,
                notification: {
                    title: title,
                    body: body,
                    type: 8,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
                data: {
                    title: title,
                    body: body,
                    type: 8,
                    id: groupId,
                    picture: pic,
                    fcmToken: fcmToken,
                },
            };
        });
        this.pushNotifications(message);
    }
};
ApnsService = __decorate([
    (0, common_1.Injectable)()
], ApnsService);
exports.ApnsService = ApnsService;
//# sourceMappingURL=apns.service.js.map