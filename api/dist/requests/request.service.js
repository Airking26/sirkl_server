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
exports.JoinService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const apns_service_1 = require("../apns/apns.service");
const response_user_1 = require("../user/response/response.user");
const stream_chat_1 = require("stream-chat");
let JoinService = class JoinService {
    constructor(userModel, requestModel, notificationModel, apnsService) {
        this.userModel = userModel;
        this.requestModel = requestModel;
        this.notificationModel = notificationModel;
        this.apnsService = apnsService;
    }
    async createRequestToJoinPrivateGroup(data, user) {
        const exists = await this.requestModel.findOne({ requester: data.requester, receiver: data.receiver, channelId: data.channelId });
        if (exists)
            throw new common_1.BadRequestException("REQUEST_ALREADY_SENT");
        const him = await this.userModel.findById(data.receiver);
        const request = await new this.requestModel({ requester: data.requester, receiver: data.receiver, channelId: data.channelId, channelName: data.channelName }).save();
        if (!request)
            throw new common_1.BadRequestException('CANT_SAVE_REQUEST');
        const body = user.userName != "" ? user.userName + " has requested to join " + data.channelName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + data.channelName;
        new this.notificationModel({ channelId: data.channelId, channelName: data.channelName, requester: data.requester, hasBeenRead: false, type: 7, idData: user.id, picture: user.picture, belongTo: data.receiver, username: user.userName != "" ? user.userName : user.wallet, message: body, paying: data.paying }).save();
        if (him.fcmTokens.length > 0) {
            if (him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.receiveRequestToJoinGroupAndroid(user, him.fcmTokens.map(it => it.token), data.channelName);
            else
                this.apnsService.receiveRequestToJoinGroupIOS(user, him.fcmTokens.map(it => it.token), data.channelName);
        }
        return request;
    }
    async retrieveRequests(channelId, user) {
        const res = await this.requestModel.find({ channelId: channelId });
        if (!res) {
            throw new common_1.BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        }
        const recipients = await this.requestModel.populate(res, { path: 'requester' });
        return (0, response_user_1.formatMultipleUsersDTO)(recipients.map(it => it.requester), user);
    }
    async acceptDeclineRequest(data, me) {
        if (data.accept) {
            const apiKey = "mhgk84t9jfnt";
            const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
            const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
            const channels = await serverClient.queryChannels({ type: 'try', id: data.channelId }, {}, { limit: 1 });
            var body;
            if (data.paying) {
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
                body = me.userName != "" ? me.userName + " has accepted your request to join " + data.channelName + " you now, need to pay the admission fee" : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " has accepted your request to join " + data.channelNam + " you now, need to pay the admission fee";
            }
            else {
                await channels[0].addMembers([data.requester]);
                body = me.userName != "" ? me.userName + " added you in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " added you in group " + data.channelName;
            }
            const him = await this.userModel.findById(data.requester);
            new this.notificationModel({ hasBeenRead: false, type: 5, idData: me.id, picture: me.picture, belongTo: data.requester, username: me.userName != "" ? me.userName : me.wallet, message: body, channelId: data.channelId }).save();
            if (him.fcmTokens.length > 0) {
                if (him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android")
                    this.apnsService.userAddedInGroupAndroid(me, him.fcmTokens.map(it => it.token), data.channelId, body);
                else
                    this.apnsService.userAddedInGroupIOS(me, him.fcmTokens.map(it => it.token), data.channelId, body);
            }
            await this.requestModel.findOneAndDelete({ requester: data.requester, receiver: data.receiver });
            await this.notificationModel.findOneAndDelete({ requester: data.requester, channelId: data.channelId, belongTo: me.id });
        }
        else {
            await this.requestModel.findOneAndDelete({ requester: data.requester, receiver: data.receiver });
            await this.notificationModel.findOneAndDelete({ requester: data.requester, channelId: data.channelId, belongTo: me.id });
        }
    }
};
JoinService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Join')),
    __param(2, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        apns_service_1.ApnsService])
], JoinService);
exports.JoinService = JoinService;
//# sourceMappingURL=request.service.js.map