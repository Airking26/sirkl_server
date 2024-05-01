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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const notification_service_1 = require("./notification.service");
const response_notification_1 = require("./response/response.notification");
const dto_notification_to_all_1 = require("../apns/dto/dto.notification_to_all");
const dto_notification_added_in_group_1 = require("../apns/dto/dto.notification_added_in_group");
let NotificationController = class NotificationController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    getNotifications(offset, id, request) {
        return this.commentService.showNotifications(id, request.user, offset);
    }
    deleteNotification(id, request) {
        return this.commentService.removeNotification(id);
    }
    checkUnreadNotification(id, request) {
        return this.commentService.hasNotifUnread(id, request);
    }
    registerNotification(request, notif) {
        return this.commentService.registerNotification(request.user, notif);
    }
    notifyAddedInGroup(request, naoa) {
        return this.commentService.notifyUserAddedInGroup(request.user, naoa);
    }
    notifyUserAsAdmin(request, naoa) {
        return this.commentService.notifyUserAsAdmin(request.user, naoa);
    }
    notifyUserInvitedToJoinPayingGroup(request, naoa) {
        return this.commentService.notifyUserInvitedToJoinGroup(request.user, naoa);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get notifications for a given user' }),
    (0, swagger_1.ApiOkResponse)({ type: response_notification_1.NotificationInfoDTO, isArray: true }),
    (0, common_1.Get)(':id/notifications/:offset'),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    (0, swagger_1.ApiOkResponse)({ type: response_notification_1.NotificationInfoDTO }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has unread notifications' }),
    (0, swagger_1.ApiOkResponse)({ type: Boolean }),
    (0, common_1.Get)(':id/unreadNotif'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "checkUnreadNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register notification' }),
    (0, swagger_1.ApiBody)({ type: dto_notification_to_all_1.NotificationToAllDTO, required: true }),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_notification_to_all_1.NotificationToAllDTO]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "registerNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "User added in group" }),
    (0, swagger_1.ApiBody)({ type: dto_notification_added_in_group_1.NotificationAddedOrAdmin, required: true }),
    (0, common_1.Post)("added_in_group"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_notification_added_in_group_1.NotificationAddedOrAdmin]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "notifyAddedInGroup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "User as admin" }),
    (0, swagger_1.ApiBody)({ type: dto_notification_added_in_group_1.NotificationAddedOrAdmin, required: true }),
    (0, common_1.Post)("upgraded_as_admin"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_notification_added_in_group_1.NotificationAddedOrAdmin]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "notifyUserAsAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Notify user invited in paying group" }),
    (0, swagger_1.ApiBody)({ type: dto_notification_added_in_group_1.NotificationAddedOrAdmin, required: true }),
    (0, common_1.Post)("invited_to_join_paying_group"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_notification_added_in_group_1.NotificationAddedOrAdmin]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "notifyUserInvitedToJoinPayingGroup", null);
NotificationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Notification'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map