"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const response_user_1 = require("../user/response/response.user");
const response_notification_1 = require("./response/response.notification");
const apns_service_1 = require("../apns/apns.service");
const stream_chat_1 = require("stream-chat");
let NotificationService = class NotificationService {
    constructor(notificationModel, userModel, apnsService) {
        this.notificationModel = notificationModel;
        this.userModel = userModel;
        this.apnsService = apnsService;
    }
    async showNotifications(belongTo, user, offset) {
        const res = await this.notificationModel.find({ belongTo: belongTo }).sort({ createdAt: 'descending' }).skip(offset * 12)
            .limit(12).exec();
        if (!res) {
            throw new common_1.BadRequestException('CANT_RETRIEVE_NOTIFICATIONS');
        }
        await this.notificationModel.updateMany({ belongTo: belongTo }, { hasBeenRead: true }, { new: true, useFindAndModify: false, multi: true }).exec();
        return (0, response_notification_1.formatMulitpleNotificationInfoDTO)(res, user);
    }
    async removeNotification(idNotification) {
        const res = await this.notificationModel.findByIdAndDelete(idNotification);
        if (!res) {
            throw new common_1.BadRequestException('CANT_RETRIEVE_NOTIFICATION');
        }
        return res;
    }
    async hasNotifUnread(belongTo, user) {
        const res = await this.notificationModel.find({ belongTo: belongTo, hasBeenRead: false }).exec();
        if (res.length > 0)
            return true;
        else
            return false;
    }
    async registerNotification(user, data) {
        const res = await new this.notificationModel({ hasBeenRead: false, type: 4, idData: "63f78a6188f7d4001f68699a", picture: "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png", belongTo: user.id, username: "SIRKL.io", message: data.message }).save();
        return;
    }
    async notifyUserAddedInGroup(me, data) {
        const body = me.userName != "" ? me.userName + " added you in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " added you in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser);
        new this.notificationModel({ hasBeenRead: false, type: 5, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName : me.wallet, message: body, channelId: data.idChannel }).save();
        if (him.fcmTokens.length > 0) {
            if (him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.userAddedInGroupAndroid(me, him.fcmTokens.map(it => it.token), data.idChannel, body);
            else
                this.apnsService.userAddedInGroupIOS(me, him.fcmTokens.map(it => it.token), data.idChannel, body);
        }
    }
    async notifyUserAsAdmin(me, data) {
        const body = me.userName != "" ? me.userName + " upgraded you as admin in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " upgraded you as admin in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser);
        new this.notificationModel({ hasBeenRead: false, type: 6, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName : me.wallet, message: body }).save();
        if (him.fcmTokens.length > 0) {
            if (him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.userAddedAsAdminAndroid(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel);
            else
                this.apnsService.userAddedAsAdminIOS(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel);
        }
    }
    async notifyUserInvitedToJoinGroup(me, data) {
        const body = me.userName != "" ? me.userName + " has invited you to join group " + data.channelName + " for " + data.channelPrice + "ETH" : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " has invited you to join group " + data.channelName + " for " + data.channelPrice + "ETH";
        const him = await this.userModel.findById(data.idUser);
        if (data.paying) {
            const apiKey = "mhgk84t9jfnt";
            const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
            const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
            const channels = await serverClient.queryChannels({ type: 'try', id: data.channelId }, {}, { limit: 1 });
            let usersAwaiting = null;
            usersAwaiting = channels[0].data.usersAwaiting;
            if (usersAwaiting instanceof Array) {
                if (!usersAwaiting.includes(data.requester)) {
                    usersAwaiting.push(data.requester);
                }
            }
            else {
                usersAwaiting = [data.requester];
            }
            await channels[0].updatePartial({ set: { "users_awaiting": usersAwaiting } });
        }
        new this.notificationModel({ hasBeenRead: false, type: 8, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName : me.wallet, message: body, channelId: data.idChannel, inviteId: data.inviteId, channelPrice: data.channelPrice }).save();
        if (him.fcmTokens.length > 0) {
            this.apnsService.userInvitedToJoinGroup(me, him.fcmTokens.map(it => it.token), body, data.idChannel);
        }
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        apns_service_1.ApnsService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map