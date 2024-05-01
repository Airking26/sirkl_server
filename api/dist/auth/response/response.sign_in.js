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
exports.formatToRefreshTokenDTO = exports.RefreshTokenDTO = exports.formatToSignInSuccessDTO = exports.SignInSuccessDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const interface_user_1 = require("../../user/interface/interface.user");
const response_user_1 = require("../../user/response/response.user");
class SignInSuccessDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: response_user_1.UserInfoDTO }),
    __metadata("design:type", response_user_1.UserInfoDTO)
], SignInSuccessDTO.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SignInSuccessDTO.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SignInSuccessDTO.prototype, "refreshToken", void 0);
exports.SignInSuccessDTO = SignInSuccessDTO;
function formatToSignInSuccessDTO(accessToken, refreshToken, user) {
    return { user: (0, response_user_1.formatToUserDTO)(user, user), accessToken, refreshToken };
}
exports.formatToSignInSuccessDTO = formatToSignInSuccessDTO;
class RefreshTokenDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], RefreshTokenDTO.prototype, "accessToken", void 0);
exports.RefreshTokenDTO = RefreshTokenDTO;
function formatToRefreshTokenDTO(accessToken) {
    return { accessToken };
}
exports.formatToRefreshTokenDTO = formatToRefreshTokenDTO;
//# sourceMappingURL=response.sign_in.js.map