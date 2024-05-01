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
exports.formatLatestUserCountDTO = exports.formatToUsersCountDTO = exports.formatMultipleUsersDTO = exports.formatToUserDTO = exports.UsersCountDTO = exports.LatestUserDTO = exports.UserInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserInfoDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "picture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "isAdmin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], UserInfoDTO.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "wallet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UserInfoDTO.prototype, "following", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "isInFollowing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "apnToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], UserInfoDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "platformCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UserInfoDTO.prototype, "platformUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], UserInfoDTO.prototype, "hasSBT", void 0);
exports.UserInfoDTO = UserInfoDTO;
class LatestUserDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], LatestUserDTO.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], LatestUserDTO.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LatestUserDTO.prototype, "param", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LatestUserDTO.prototype, "name", void 0);
exports.LatestUserDTO = LatestUserDTO;
class UsersCountDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UsersCountDTO.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserInfoDTO, isArray: true }),
    __metadata("design:type", Array)
], UsersCountDTO.prototype, "users", void 0);
exports.UsersCountDTO = UsersCountDTO;
function formatToUserDTO(user, ref) {
    const { id, userName, picture, isAdmin, createdAt, description, fcmToken, wallet, following, apnToken, updatedAt, platformCreated, platformUpdated, hasSBT } = user;
    const isInFollowing = ref ? ref.following.includes(id) : undefined;
    const nickname = ref ? ref.nicknames.get(wallet) : undefined;
    return {
        id,
        userName,
        picture,
        isAdmin,
        createdAt,
        description,
        fcmToken,
        nickname,
        wallet,
        apnToken,
        following: following.length,
        isInFollowing: isInFollowing,
        updatedAt,
        platformCreated,
        platformUpdated,
        hasSBT
    };
}
exports.formatToUserDTO = formatToUserDTO;
function formatMultipleUsersDTO(users, user) {
    return users.map(it => formatToUserDTO(it, user));
}
exports.formatMultipleUsersDTO = formatMultipleUsersDTO;
function formatToUsersCountDTO(usersSearchedAccount, users, user) {
    return { count: usersSearchedAccount, users: formatMultipleUsersDTO(users, user) };
}
exports.formatToUsersCountDTO = formatToUsersCountDTO;
function formatLatestUserCountDTO(from, to, count) {
    return {
        from, to, count
    };
}
exports.formatLatestUserCountDTO = formatLatestUserCountDTO;
//# sourceMappingURL=response.user.js.map