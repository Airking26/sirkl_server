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
exports.FollowService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_user_1 = require("../user/response/response.user");
const apns_service_1 = require("../apns/apns.service");
const interface_fcm_tokens_1 = require("../apns/interface/interface.fcm-tokens");
let FollowService = class FollowService {
    constructor(userModel, followModel, notificationModel, apnsService) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.notificationModel = notificationModel;
        this.apnsService = apnsService;
    }
    async follow(user, userId) {
        const u = await this.userModel.populate(user, "following");
        if (u.following.map(it => it.id).includes(userId)) {
            throw new common_1.BadRequestException('USER_ALREADY_FOLLOWED');
        }
        const data = await new this.followModel({ recipient: userId, requester: user.id }).save();
        if (!data) {
            throw new common_1.BadRequestException('CANT_SAVE_FOLLOWING REQUEST');
        }
        const me = await this.userModel.findByIdAndUpdate(user.id, { $addToSet: { following: userId } }, { new: true, useFindAndModify: false }).exec();
        if (!me) {
            throw new common_1.BadRequestException('CANT_UPDATE_YOUR_FOLLOWERS');
        }
        const him = await this.userModel.findById(userId);
        new this.notificationModel({ hasBeenRead: false, type: 0, idData: me.id, picture: me.picture, belongTo: him.id, username: me.userName != "" ? me.userName : me.wallet }).save();
        new this.notificationModel({ hasBeenRead: true, type: 1, idData: him.id, picture: him.picture, belongTo: me.id, username: him.userName != "" ? him.userName : him.wallet }).save();
        if (him.fcmTokens.length > 0) {
            if (him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android")
                this.apnsService.addedByUserAndroid(me, him.fcmTokens.map(it => it.token));
            else
                this.apnsService.addedByUserIOS(me, him.fcmTokens.map(it => it.token));
        }
        return (0, response_user_1.formatToUserDTO)(him, me);
    }
    async unfollow(user, userId) {
        const u = await this.userModel.populate(user, "following");
        if (!u.following.map(it => it.id).includes(userId)) {
            throw new common_1.BadRequestException('USER_ALREADY_NOT_FOLLOWED');
        }
        const userToLocate = await this.userModel.findById(userId);
        const remove = await this.followModel.findOneAndRemove({ recipient: userToLocate, requester: user }).exec();
        if (!remove) {
            throw new common_1.BadRequestException('CANT_REMOVE_FOLLOWING_REQUEST');
        }
        const me = await this.userModel.findByIdAndUpdate(user.id, { $pull: { following: userId } }, { new: true, useFindAndModify: false }).exec();
        if (!me) {
            throw new common_1.BadRequestException('CANT_UPDATE_YOUR_FOLLOWERS');
        }
        const him = await this.userModel.findByIdAndUpdate(userId, { $pull: { followers: user.id } }, { new: true, useFindAndModify: false }).exec();
        if (!him) {
            throw new common_1.BadRequestException('CANT_UPDATE_HIS_FOLLOWERS');
        }
        return (0, response_user_1.formatToUserDTO)(him, me);
    }
    async showFollowingUsers(userID, user) {
        const userToLocate = await this.userModel.findById(userID);
        const res = await this.followModel.find({ requester: userToLocate });
        if (!res) {
            throw new common_1.BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        }
        const recipients = await this.followModel.populate(res, { path: 'recipient' });
        return (0, response_user_1.formatMultipleUsersDTO)(recipients.map(it => it.recipient), user);
    }
    async isInFollowing(userID, user) {
        return user.following.includes(userID);
    }
    async searchInFollowing(user, name, offset) {
        const u = await this.userModel.populate(user, 'following');
        if (!u) {
            throw new common_1.BadRequestException('ERROR_FETCHING_FOLLOWERS');
        }
        const res = u.following.filter(item => item.userName.includes(name));
        const users = res.filter((x, i) => { if (i > ((offset * 12) - 1)) {
            return true;
        } }).filter((x, i) => { if (i <= (12 - 1)) {
            return true;
        } });
        return (0, response_user_1.formatMultipleUsersDTO)(users, user);
    }
};
FollowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Follow')),
    __param(2, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        apns_service_1.ApnsService])
], FollowService);
exports.FollowService = FollowService;
//# sourceMappingURL=follow.service.js.map