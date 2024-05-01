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
exports.NicknamesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const dto_nickname_1 = require("./dto/dto.nickname");
const nicknames_service_1 = require("./nicknames.service");
let NicknamesController = class NicknamesController {
    constructor(nicknamesService) {
        this.nicknamesService = nicknamesService;
    }
    retrieveInboxes(request) {
        return this.nicknamesService.retrieveNicknames(request.user);
    }
    updateInbox(nicknameCreationDTO, wallet, request) {
        return this.nicknamesService.addNickname(request.user, wallet, nicknameCreationDTO.nickname);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve nicknames" }),
    (0, common_1.Get)("retrieve"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NicknamesController.prototype, "retrieveInboxes", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'update nicknames' }),
    (0, swagger_1.ApiParam)({ name: "wallet", description: "wallet", allowEmptyValue: false }),
    (0, swagger_1.ApiBody)({ type: dto_nickname_1.NicknameCreationDTO, required: true }),
    (0, common_1.Put)(":wallet"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('wallet')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_nickname_1.NicknameCreationDTO, String, Object]),
    __metadata("design:returntype", void 0)
], NicknamesController.prototype, "updateInbox", null);
NicknamesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Nicknames"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("nicknames"),
    __metadata("design:paramtypes", [nicknames_service_1.NicknamesService])
], NicknamesController);
exports.NicknamesController = NicknamesController;
//# sourceMappingURL=nicknames.controller.js.map