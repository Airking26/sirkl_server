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
exports.CallService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const apns_service_1 = require("../apns/apns.service");
const interface_fcm_tokens_1 = require("../apns/interface/interface.fcm-tokens");
const interface_nicknames_1 = require("../nicknames/interface/interface.nicknames");
const interface_user_1 = require("../user/interface/interface.user");
const response_call_1 = require("./response/response.call");
let CallService = class CallService {
    constructor(callModel, userModel, nicknamesModel, apnsService) {
        this.callModel = callModel;
        this.userModel = userModel;
        this.nicknamesModel = nicknamesModel;
        this.apnsService = apnsService;
    }
    async sendCallInvitationNotification(user, channel, userID, callId) {
        const userToLocate = await this.userModel.findById(userID);
        if (userToLocate.fcmTokens.length > 0) {
            if (userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.callInvitationAndroid(user, channel, userToLocate.fcmTokens.map(it => it.token), userID, callId);
            else {
                this.apnsService.callInvitationApn(user, channel, userToLocate.apnToken, userID, callId);
            }
        }
        return userToLocate;
    }
    async retrieveCalls(user, offset) {
        const res = await this.callModel.find({ ownedBy: user }).populate('ownedBy').populate('called').sort({ updatedAt: "descending" }).skip(offset * 12).limit(12).exec();
        if (!res)
            throw new common_1.BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        return (0, response_call_1.formatMultipleCallDTO)(res, user);
    }
    async createCall(data, user) {
        const call = await new this.callModel({ ownedBy: user.id, called: data.called, status: 0, updatedAt: data.updatedAt }).save();
        const callReceived = await new this.callModel({ ownedBy: data.called, called: user.id, status: 1, updatedAt: data.updatedAt }).save();
        const userToLocate = await this.sendCallInvitationNotification(user, data.channel, data.called, callReceived.id);
        call.called = userToLocate;
        return (0, response_call_1.formatToCallDTO)(call, user);
    }
    async updateCallStatus(data, user) {
        const call = await this.callModel.findById(data.id).populate('ownedBy').populate('called');
        call.status = data.status;
        call.updatedAt = data.updatedAt;
        await call.save();
        return (0, response_call_1.formatToCallDTO)(call, user);
    }
    async missedCall(userId, user) {
        const userToLocate = await this.userModel.findById(userId);
        if (userToLocate.fcmTokens.length > 0) {
            if (userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.missedCallAndroid(user, userToLocate.fcmTokens.map(it => it.token));
            else
                this.apnsService.missedCallIOS(user, userToLocate.fcmTokens.map(it => it.token));
        }
    }
    async endACall(channelId, user, userID) {
        const userToLocate = await this.userModel.findById(userID);
        if (userToLocate.fcmTokens.length > 0) {
            if (userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.declineCallAndroid(channelId, userToLocate.fcmTokens.map(it => it.token));
            else
                this.apnsService.declineCallIOS(channelId, userToLocate.fcmTokens.map(it => it.token));
        }
    }
    async searchCalls(substring, user) {
        const calls = await this.callModel.find({ ownedBy: user }).populate('ownedBy').populate('called').sort({ updatedAt: "descending" }).exec();
        const userToLocate = await this.userModel.findById(user.id);
        const wallet = this.getByValue(new Map(userToLocate.nicknames), substring);
        let results;
        if (wallet) {
            results = calls.filter((el) => {
                return el.called.userName.toLowerCase().startsWith(substring.toLowerCase()) ||
                    el.called.wallet.toLowerCase().startsWith(substring.toLowerCase()) ||
                    el.called.wallet.toLowerCase().startsWith(wallet.toString().toLowerCase());
            });
        }
        else {
            results = calls.filter((el) => {
                return el.called.userName.toLowerCase().startsWith(substring.toLowerCase()) ||
                    el.called.wallet.toLowerCase().startsWith(substring.toLowerCase());
            });
        }
        return (0, response_call_1.formatMultipleCallDTO)(results, user);
    }
    getByValue(map, searchValue) {
        for (let [key, value] of map) {
            if (value.toLowerCase() === searchValue.toLowerCase())
                return key.toString();
        }
    }
};
CallService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("Call")),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __param(2, (0, mongoose_1.InjectModel)('Nicknames')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        apns_service_1.ApnsService])
], CallService);
exports.CallService = CallService;
//# sourceMappingURL=call.service.js.map