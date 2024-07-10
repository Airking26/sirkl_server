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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_user_1 = require("./response/response.user");
const apns_service_1 = require("../apns/apns.service");
const dto_sign_up_1 = require("../auth/dto/dto.sign-up");
const stream_chat_1 = require("stream-chat");
const dto_wallet_connect_1 = require("../auth/dto/dto.wallet-connect");
const agora_access_token_1 = require("agora-access-token");
const auth_passport_interface_jwt_payload_1 = require("../auth/passport/interface/auth.passport.interface.jwt_payload");
const interface_follow_1 = require("../follow/interface/interface.follow");
const interface_call_1 = require("../call/interface/interface.call");
const interface_inbox_1 = require("../inbox/interface/interface.inbox");
const interface_nicknames_1 = require("../nicknames/interface/interface.nicknames");
const interface_notification_1 = require("../notifications/interface/interface.notification");
const story_interface_1 = require("../story/interface/story.interface");
const interface_nft_1 = require("../nfts/interface/interface.nft");
const hmac_sha512_1 = __importDefault(require("crypto-js/hmac-sha512"));
const https_1 = require("https");
const socket_io_client_1 = require("socket.io-client");
const interface_fcm_tokens_1 = require("../apns/interface/interface.fcm-tokens");
const follow_service_1 = require("../follow/follow.service");
let UserService = class UserService {
    constructor(userModel, followModel, callModel, inboxModel, nicknamesModel, notificationModel, storyModel, nftModel, followService) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.callModel = callModel;
        this.inboxModel = inboxModel;
        this.nicknamesModel = nicknamesModel;
        this.notificationModel = notificationModel;
        this.storyModel = storyModel;
        this.nftModel = nftModel;
        this.followService = followService;
        this.logger = new common_1.Logger("ALARM");
    }
    async createUserWithWallet(wallet, ens, platform) {
        var name;
        if (ens == undefined || ens == "0")
            name = "";
        else
            name = ens;
        const walletCount = await this.userModel.count({ wallet: wallet.toLowerCase() });
        if (walletCount > 0) {
            throw new common_1.BadRequestException('WALLET_ALREADY_USED');
        }
        return new this.userModel({ wallet: wallet.toLowerCase(), platformCreated: platform, userName: name }).save();
    }
    async get_user_by_wallet(wallet) {
        return this.userModel.findOne({ wallet: wallet });
    }
    async find_user_by_wallet(user, wallet) {
        const res = await this.userModel.findOne({ wallet: wallet });
        if (!res)
            return null;
        return (0, response_user_1.formatToUserDTO)(res, user);
    }
    async connectToWS(user) {
        let socketMobile = null;
        const api = "Xz8w4MK784c5p3sPjWY3HdQA87Z9TqCTB2jNzu34vsLhzk4cK5LG5x3a9R7uj8C8";
        const payload = JSON.stringify({ "wallet": user.wallet, "user_id": user.id });
        const signature = (0, hmac_sha512_1.default)(payload, api);
        const options = {
            headers: { "X-Sirkl-Signature": signature, 'Content-Type': 'application/json', 'Content-Length': payload.length },
            method: "POST",
            hostname: 'app.sirkl.io',
            path: "/api/socket/createToken",
            body: { "wallet": user.wallet, "user_id": user.id }
        };
        const req = (0, https_1.request)(options, (res) => {
            let data = "";
            res.on('data', (d) => {
                data += d;
            });
            res.on("end", async () => {
                let token = JSON.parse(data).token;
                socketMobile = (0, socket_io_client_1.io)('https://app.sirkl.io:21000/mobile', {
                    transports: ["websocket"],
                    rejectUnauthorized: false,
                    auth: {
                        token: token,
                        wallet: user.wallet,
                        user_id: user.id
                    }
                });
                socketMobile.on('connect', function () {
                    const k = "";
                    console.log("socketMobile > connected");
                });
                socketMobile.on('disconnect', function () {
                    const k = "";
                    console.log("socketMobile > disconnect");
                });
                socketMobile.on('error', (error) => {
                    const j = error.message;
                    const k = error;
                    console.log("socketMobile > error");
                });
                socketMobile.on("ping", () => {
                    const k = "";
                    console.log("socketMobile > ping");
                });
                socketMobile.on("close", (event) => {
                    const k = event;
                    console.log("socketMobile > close");
                });
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(payload);
        req.end;
    }
    async modifyPassword(wallet, newPassword, user) {
        if (user.wallet === wallet) {
            const userToFind = await this.get_user_by_wallet(wallet);
            if (!userToFind)
                throw new common_1.NotFoundException('USERS_NOT_FOUND');
            return await this.resetPassword(userToFind, newPassword);
        }
        else
            throw new common_1.BadRequestException("NOT_AUTHORIZED");
    }
    async resetPassword(user, password) {
        const res = await this.userModel.findByIdAndUpdate(user.id, { password: password }, { new: true, useFindAndModify: false }).exec();
        if (!res)
            throw new common_1.BadRequestException('USER_NOT_FOUND');
        console.log(res);
        return (0, response_user_1.formatToUserDTO)(res, res);
    }
    async get_user_by_id(idToSearch) {
        const user = await this.userModel.findOne({ _id: idToSearch });
        if (user != null) {
            return await this.userModel.findOne({ _id: idToSearch });
        }
    }
    async update_refresh_token(refreshToken, user) {
        const res = await this.userModel
            .findByIdAndUpdate(user.id, { $addToSet: { refreshTokens: refreshToken } }, { new: true, useFindAndModify: false })
            .exec();
        if (!res) {
            throw new common_1.NotFoundException("USER_NOT_FOUND");
        }
        return res;
    }
    async deleteRefreshToken(user) {
        const res = await this.userModel
            .findByIdAndUpdate(user.id, { refreshTokens: [] }, { new: true, useFindAndModify: false })
            .exec();
        if (!res) {
            throw new common_1.NotFoundException("USER_NOT_FOUND");
        }
        return (0, response_user_1.formatToUserDTO)(res, res);
    }
    async showUser(id, user) {
        const res = await this.userModel.findById(id);
        if (!res) {
            throw new common_1.NotFoundException("USER_NOT_FOUND");
        }
        return (0, response_user_1.formatToUserDTO)(res, user);
    }
    async updateUserInfos(updateUserInfoDTO, ref) {
        const user = await this.userModel.findById(ref.id);
        if (!user) {
            throw new common_1.NotFoundException("USER_NOT_FOUND");
        }
        user.description = updateUserInfoDTO.description;
        if (updateUserInfoDTO.userName) {
            user.userName = updateUserInfoDTO.userName;
        }
        if (updateUserInfoDTO.picture) {
            user.picture = updateUserInfoDTO.picture;
        }
        if (updateUserInfoDTO.nicknames) {
            const j = updateUserInfoDTO.nicknames;
            const js = Object.entries(j).forEach(entry => {
                const [key, value] = entry;
                user.nicknames.set(key, value);
            });
            const kk = Object.keys(updateUserInfoDTO.nicknames).forEach(element => console.log(element));
        }
        if (updateUserInfoDTO.hasSBT) {
            user.hasSBT = updateUserInfoDTO.hasSBT;
        }
        const res = await user.save();
        return (0, response_user_1.formatToUserDTO)(res, res);
    }
    async updateFCMToken(updateFcmDTO, ref) {
        const user = await this.userModel.findOne({ wallet: ref.wallet });
        const existingToken = user.fcmTokens.find((it) => it.token === updateFcmDTO.token);
        if (!existingToken) {
            user.fcmTokens = [{
                    platform: updateFcmDTO.platform,
                    token: updateFcmDTO.token,
                }];
            user.fcmToken = updateFcmDTO.token;
            user.platformUpdated = updateFcmDTO.platform == interface_fcm_tokens_1.FCMTokenPlatform.android ? "android" : "iOS";
        }
        const res = await user.save();
        return (0, response_user_1.formatToUserDTO)(res, res);
    }
    async updateApnToken(token, ref) {
        if (ref.apnToken !== token) {
            const user = await this.userModel.findOne({ wallet: ref.wallet });
            if (!user)
                throw new common_1.BadRequestException("USER_DONT_EXISTS");
            user.apnToken = token;
            const res = await user.save();
            return (0, response_user_1.formatToUserDTO)(res, res);
        }
        return (0, response_user_1.formatToUserDTO)(ref, ref);
    }
    async deleteUser(userID, user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        if (user.id == userID || user.isAdmin) {
            const res = await this.userModel.findById(userID);
            if (!res) {
                throw new common_1.BadRequestException('USER_NOT_FOUND');
            }
            await this.nftModel.deleteMany({ ownedBy: res });
            await this.storyModel.deleteMany({ createdBy: res });
            await this.notificationModel.deleteMany({ $or: [{ belongTo: userID }, { idData: userID }] });
            await this.nicknamesModel.deleteMany({ ownedBy: res });
            await this.inboxModel.deleteMany({ $or: [{ createdBy: userID }, { wallets: res.wallet }] });
            await this.callModel.deleteMany({ $or: [{ ownedBy: res }, { called: res }] });
            await this.followModel.deleteMany({ $or: [{ requester: res }, { recipient: res }] });
            await this.userModel.updateMany({ $or: [{ following: res }] }, { $pull: { following: userID } });
            await serverClient.deleteUsers([userID], { user: 'hard', messages: 'hard', conversations: 'hard' });
            const channels = await serverClient.queryChannels({
                type: "try",
                [`${user.id}_favorite`]: { $eq: true },
            });
            for (const channel of channels) {
                await channel.updatePartial({ unset: [`${user.id}_favorite`] });
            }
            const deleteUser = await this.userModel.findByIdAndRemove(userID, {
                new: true,
                useFindAndModify: false,
            });
            return deleteUser;
        }
        else {
            throw new common_1.BadRequestException("USER_IS_NOT_ADMIN_OR_NOT_OWNER");
        }
    }
    async banProfile(id, user) {
        const profile = await this.userModel.findOneAndRemove({ _id: id });
        if (!profile) {
            throw new common_1.NotFoundException("PROFILE_DOEST_NOT_EXIST");
        }
        return (0, response_user_1.formatToUserDTO)(profile, profile);
    }
    generateStreamChatToken(user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        const token = serverClient.createToken(user.id);
        return token;
    }
    async connectToGetStream(user) {
        var _a;
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        return await serverClient.connectUser({ id: user.id, name: (_a = user.userName) !== null && _a !== void 0 ? _a : user.wallet, extraData: { 'userDTO': (0, response_user_1.formatToUserDTO)(user, user) } }, this.generateStreamChatToken(user));
    }
    async receiveWelcomeMessage(user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        const channel = serverClient.channel("try", { members: [user.id, "63f78a6188f7d4001f68699a"], created_by_id: "63f78a6188f7d4001f68699a", isConv: true });
        await channel.watch();
        await channel.sendMessage({ text: "Welcome to SIRKL", user_id: "63f78a6188f7d4001f68699a" });
    }
    async makeUserAdmin(adminDTO, user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        var channels = await serverClient.queryChannels({ type: 'try', id: { $eq: adminDTO.idChannel } });
        var assign = await channels[0].assignRoles([{ user_id: adminDTO.userToUpdate, channel_role: adminDTO.makeAdmin ? "channel_moderator" : "channel_member" }]);
    }
    async addToSirklClub(user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        var channels = await serverClient.queryChannels({ type: 'try', id: { $eq: "0x2B2535Ba07Cd144e143129DcE2dA4f21145a5011".toLowerCase() } });
        await channels[0].addMembers([user.id]);
    }
    async generateAgoraTokenRTC(channel, roleReceived, tokenType, uid, req) {
        const appID = "13d8acd177bf4c35a0d07bdd18c8e84e";
        const appCertificate = "31d5d34b33e64c87a498b2ecbc67c4b9";
        let role;
        if (roleReceived === 'publisher') {
            role = agora_access_token_1.RtcRole.PUBLISHER;
        }
        else if (roleReceived === 'audience') {
            role = agora_access_token_1.RtcRole.SUBSCRIBER;
        }
        let i = req;
        let expireTime = req.query.expiry;
        if (!expireTime || expireTime === '') {
            expireTime = 3600;
        }
        else {
            expireTime = parseInt(expireTime, 10);
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTime + expireTime;
        let token;
        if (tokenType === 'userAccount') {
            token = agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channel, uid, role, privilegeExpireTime);
        }
        else if (tokenType === 'uid') {
            token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, Number("uid"), role, privilegeExpireTime);
        }
        return token;
    }
    async getLatestActiveUsersBetweenDates(offset, from, to, param, user) {
        if (!user.isAdmin) {
            throw new common_1.NotAcceptableException('USER_IS_NOT_ADMIN');
        }
        var sort;
        var find;
        if (param == 1) {
            sort = { updatedAt: -1 };
            find = { updatedAt: { $gte: from, $lt: to } };
        }
        else if (param == 2) {
            sort = { updatedAt: 1 };
            find = { updatedAt: { $gte: from, $lt: to } };
        }
        else if (param == 3) {
            sort = { updatedAt: -1 };
            find = { platformCreated: "android", updatedAt: { $gte: from, $lt: to } };
        }
        else if (param == 4) {
            find = { platformCreated: "iOS", updatedAt: { $gte: from, $lt: to } };
            sort = { updatedAt: -1 };
        }
        else if (param == 5) {
            find = { platformCreated: "Web", updatedAt: { $gte: from, $lt: to } };
            sort = { updatedAt: -1 };
        }
        else if (param == 6) {
            sort = { createdAt: 1 };
            find = { platformCreated: "android", updatedAt: { $gte: from, $lt: to } };
        }
        else if (param == 7) {
            find = { platformCreated: "iOS", updatedAt: { $gte: from, $lt: to } };
            sort = { createdAt: 1 };
        }
        else if (param == 8) {
            find = { platformCreated: "Web", updatedAt: { $gte: from, $lt: to } };
            sort = { createdAt: 1 };
        }
        const r = await this.userModel.find(find).count();
        const res = await this.userModel.find(find)
            .sort(sort)
            .skip(offset * 50)
            .limit(50).exec();
        if (!res)
            throw new common_1.BadRequestException('USERS_NOT_FOUND');
        return (0, response_user_1.formatToUsersCountDTO)(r, res, user);
    }
    async getLatestUsersBetweenDates(offset, user, from, to, param, name) {
        var sort;
        var adminParam;
        var res;
        if (!user.isAdmin) {
            throw new common_1.NotAcceptableException('USER_IS_NOT_ADMIN');
        }
        if (name)
            adminParam = {
                $or: [{ userName: { $regex: name, $options: 'i' } }, { givenName: { $regex: name, $options: 'i' } }],
                createdAt: { $gte: from, $lt: to }
            };
        else
            adminParam = { createdAt: { $gte: from, $lt: to } };
        if (param == 0)
            sort = { userName: 1 };
        else if (param == 1)
            sort = { userName: -1 };
        else if (param == 2)
            sort = { wallet: 1 };
        else if (param == 3)
            sort = { wallet: -1 };
        else if (param == 4)
            sort = { createdAt: 1 };
        else if (param == 5)
            sort = { createdAt: -1 };
        res = await this.userModel.find(adminParam)
            .sort(sort)
            .skip(offset * 50)
            .limit(50).exec();
        const r = await this.userModel.find(adminParam).count();
        if (!res) {
            throw new common_1.BadRequestException('USERS_NOT_FOUND');
        }
        return (0, response_user_1.formatToUsersCountDTO)(r, res, user);
    }
    async getLatestUsersCountBetweenDates(user, from, to) {
        if (!user.isAdmin) {
            throw new common_1.NotAcceptableException('USER_IS_NOT_ADMIN');
        }
        const res = await this.userModel.countDocuments({
            createdAt: {
                $gte: from,
                $lt: to
            }
        });
        if (!res) {
            throw new common_1.BadRequestException('USERS_NOT_FOUND');
        }
        return (0, response_user_1.formatLatestUserCountDTO)(from, to, res);
    }
    async changeUpdatedAt(wallet) {
        return this.userModel.findOneAndUpdate({ wallet: wallet }, { updatedAt: new Date(Date.now()) }, { new: true, useFindAndModify: false });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("User")),
    __param(1, (0, mongoose_1.InjectModel)('Follow')),
    __param(2, (0, mongoose_1.InjectModel)('Call')),
    __param(3, (0, mongoose_1.InjectModel)('Inbox')),
    __param(4, (0, mongoose_1.InjectModel)('Nicknames')),
    __param(5, (0, mongoose_1.InjectModel)('Notification')),
    __param(6, (0, mongoose_1.InjectModel)('Story')),
    __param(7, (0, mongoose_1.InjectModel)('NFT')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        follow_service_1.FollowService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map