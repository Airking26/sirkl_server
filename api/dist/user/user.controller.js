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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const dto_update_fcm_1 = require("./dto/dto.update_fcm");
const dto_update_user_1 = require("./dto/dto.update_user");
const response_user_1 = require("./response/response.user");
const user_service_1 = require("./user.service");
const dto_admin_1 = require("./dto/dto.admin");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getCurrentUser(request) {
        return this.userService.showUser(request.user.id, request.user);
    }
    updateUser(request, data) {
        return this.userService.updateUserInfos(data, request.user);
    }
    connecToWS(request) {
        return this.userService.connectToWS(request.user);
    }
    deleteUser(id, request) {
        return this.userService.deleteUser(id, request.user);
    }
    getUser(id, request) {
        return this.userService.showUser(id, request.user);
    }
    updateFCMToken(request, data) {
        return this.userService.updateFCMToken(data, request.user);
    }
    updateAPNToken(request, apn) {
        return this.userService.updateApnToken(apn, request.user);
    }
    retrieveUserByWallet(wallet, request) {
        return this.userService.find_user_by_wallet(request.user, wallet);
    }
    retrieveStreamChatToken(request) {
        return this.userService.generateStreamChatToken(request.user);
    }
    connectToGetStream(request) {
        return this.userService.connectToGetStream(request.user);
    }
    changeAdminRole(adminUserGetStream, request) {
        return this.userService.makeUserAdmin(adminUserGetStream, request.user);
    }
    addUserToSirklClub(id, request) {
        return this.userService.addToSirklClub(request.user);
    }
    getWelcomingMessage(request) {
        return this.userService.receiveWelcomeMessage(request.user);
    }
    retrieveAgoraTokenRTC(request, channel, role, tokenType, uid) {
        return this.userService.generateAgoraTokenRTC(channel, role, tokenType, uid, request);
    }
    getNewUsersBetweenDates(offset, body, request) {
        return this.userService.getLatestUsersBetweenDates(offset, request.user, body.from, body.to, body.param, body.name);
    }
    getActiveUsersBetweenDates(offset, body, request) {
        return this.userService.getLatestActiveUsersBetweenDates(offset, body.from, body.to, body.param, request.user);
    }
    getNewUsersCountBetweenDates(body, request) {
        return this.userService.getLatestUsersCountBetweenDates(request.user, body.from, body.to);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get user infos" }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getCurrentUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Modify User infos" }),
    (0, swagger_1.ApiBody)({ type: dto_update_user_1.UpdateUserInfoDTO, required: true }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Patch)("me"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_update_user_1.UpdateUserInfoDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Connect to WS" }),
    (0, common_1.Post)("connect_to_ws"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "connecToWS", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete user" }),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get user by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User id", allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload an FCM Token" }),
    (0, swagger_1.ApiBody)({ type: dto_update_fcm_1.UpdateFcmDTO, required: true }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Put)("me/fcm"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_update_fcm_1.UpdateFcmDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateFCMToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload an APN Token" }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, swagger_1.ApiParam)({ name: "apn", description: "APN Token", allowEmptyValue: false }),
    (0, common_1.Put)("me/apn/:apn"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("apn")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateAPNToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve user by wallet" }),
    (0, swagger_1.ApiParam)({ name: "wallet", description: "User wallet", allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO }),
    (0, common_1.Get)("search/:wallet"),
    __param(0, (0, common_1.Param)("wallet")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "retrieveUserByWallet", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve token to streamchat" }),
    (0, swagger_1.ApiOkResponse)({ type: String }),
    (0, common_1.Get)("me/tokenStreamChat"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "retrieveStreamChatToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "connect to getstream" }),
    (0, common_1.Get)("me/connect_to_get_stream"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "connectToGetStream", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "make user admin or remove admin role" }),
    (0, swagger_1.ApiBody)({ type: dto_admin_1.AdminUserGetStream, required: true }),
    (0, common_1.Post)("admin_role"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_admin_1.AdminUserGetStream, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "changeAdminRole", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add user to Sirkl Club" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User id", allowEmptyValue: false }),
    (0, common_1.Get)("add_user_to_sirkl_club/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "addUserToSirklClub", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "receive welcome message" }),
    (0, common_1.Get)("me/welcome_message"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getWelcomingMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve agora token" }),
    (0, swagger_1.ApiOkResponse)({ type: String }),
    (0, common_1.Header)('Cache-Control', 'private, no-cache, no-store, must-revalidate'),
    (0, common_1.Header)('Expires', '-1'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    (0, swagger_1.ApiParam)({ name: 'channel', allowEmptyValue: false }),
    (0, swagger_1.ApiParam)({ name: 'role', allowEmptyValue: false }),
    (0, swagger_1.ApiParam)({ name: 'tokenType', allowEmptyValue: false }),
    (0, swagger_1.ApiParam)({ name: 'uid', allowEmptyValue: false }),
    (0, common_1.Get)("me/tokenAgoraRTC/:channel/:role/:tokenType/:uid"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channel')),
    __param(2, (0, common_1.Param)('role')),
    __param(3, (0, common_1.Param)('tokenType')),
    __param(4, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "retrieveAgoraTokenRTC", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get latest users signed up between 2 dates - Requires to be Admin. Param : 0 = username asc, 1 = username desc, 2 = wallet asc, 3 = wallet desc, 4 = date asc, 5 = date desc' }),
    (0, swagger_1.ApiParam)({ name: 'offset', description: 'Pass 0 to start, then increment in order to get 50 more users', allowEmptyValue: false }),
    (0, swagger_1.ApiBody)({ type: response_user_1.LatestUserDTO, isArray: false }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UsersCountDTO, isArray: false }),
    (0, common_1.Get)('newUsers/date/:offset'),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, response_user_1.LatestUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getNewUsersBetweenDates", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get latest users signed up between 2 dates - Requires to be Admin. Param : 2 = updatedAt asc, 1 = updatedAt desc, 3 = android + last updated, 4 = ios + last udpated, 5 = web + last updated, 6 = android + first connection, 7 = ios + first connection, 8 = web + first connection' }),
    (0, swagger_1.ApiParam)({ name: 'offset', description: 'Pass 0 to start, then increment in order to get 50 more users', allowEmptyValue: false }),
    (0, swagger_1.ApiBody)({ type: response_user_1.LatestUserDTO, isArray: false }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UsersCountDTO, isArray: false }),
    (0, common_1.Get)('active/date/:offset'),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, response_user_1.LatestUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getActiveUsersBetweenDates", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get latest users count who signed up between 2 dates - Requires to be Admin' }),
    (0, swagger_1.ApiBody)({ type: response_user_1.LatestUserDTO, isArray: false }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UsersCountDTO, isArray: false }),
    (0, common_1.Get)('newUsersCount/date/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [response_user_1.LatestUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getNewUsersCountBetweenDates", null);
UserController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("User"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map