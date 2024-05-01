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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationResultDTO = exports.formatMulitpleNotificationInfoDTO = exports.formatToNotificationInfoDTO = exports.NotificationInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const interface_user_1 = require("../../user/interface/interface.user");
class NotificationInfoDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], NotificationInfoDTO.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], NotificationInfoDTO.prototype, "hasBeenRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "picture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], NotificationInfoDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "belongTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "idData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "eventName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "channelName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "requester", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    __metadata("design:type", Boolean)
], NotificationInfoDTO.prototype, "paying", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "inviteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NotificationInfoDTO.prototype, "channelPrice", void 0);
exports.NotificationInfoDTO = NotificationInfoDTO;
function formatToNotificationInfoDTO(notification, user) {
    const { id, createdAt, hasBeenRead, type, picture, belongTo, username, idData, eventName, message, channelId, channelName, requester, paying, inviteId, channelPrice } = notification;
    return { id, createdAt, hasBeenRead, type, picture, belongTo, username, idData, eventName, message, channelId, channelName, requester, paying, inviteId, channelPrice };
}
exports.formatToNotificationInfoDTO = formatToNotificationInfoDTO;
function formatMulitpleNotificationInfoDTO(notifications, user) {
    return notifications.map(it => formatToNotificationInfoDTO(it, user));
}
exports.formatMulitpleNotificationInfoDTO = formatMulitpleNotificationInfoDTO;
class NotificationResultDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: NotificationInfoDTO, isArray: true }),
    (0, class_transformer_1.Type)(() => NotificationInfoDTO),
    (0, class_validator_1.IsArray)({}),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], NotificationResultDTO.prototype, "notifications", void 0);
exports.NotificationResultDTO = NotificationResultDTO;
//# sourceMappingURL=response.notification.js.map