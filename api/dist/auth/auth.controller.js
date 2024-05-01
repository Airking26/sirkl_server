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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_user_1 = require("../user/response/response.user");
const auth_service_1 = require("./auth.service");
const dto_wallet_connect_1 = require("./dto/dto.wallet-connect");
const auth_guard_1 = __importDefault(require("./passport/auth_guard"));
const response_sign_in_1 = require("./response/response.sign_in");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    refreshAccessToken(request) {
        return this.authService.handleRefreshToken(request.user);
    }
    createUAW() {
        return this.authService.createUAW();
    }
    logOut(request) {
        return this.authService.signUserOut(request.user);
    }
    verifySignature(walletConnectDTO) {
        return this.authService.verifySignature(walletConnectDTO);
    }
    createWalletOnTheFly() {
        return this.authService.createWalletOnTheFly();
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Pass refresh token in order to get a new access token' }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_sign_in_1.RefreshTokenDTO }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Unanthorized, user must log back in' }),
    (0, common_1.UseGuards)(auth_guard_1.default),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, common_1.Get)('createUAW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUAW", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Log user out' }),
    (0, swagger_1.ApiCreatedResponse)({ type: response_user_1.UserInfoDTO }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, common_1.UseGuards)(auth_guard_1.default),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logOut", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "verify signature" }),
    (0, common_1.Post)("verifySignature"),
    (0, swagger_1.ApiBody)({ type: dto_wallet_connect_1.WalletConnectDTO }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_wallet_connect_1.WalletConnectDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifySignature", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "create wallet" }),
    (0, common_1.Get)("create"),
    (0, swagger_1.ApiCreatedResponse)({ type: response_sign_in_1.SignInSuccessDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createWalletOnTheFly", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map