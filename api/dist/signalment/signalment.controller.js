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
exports.SignalmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const response_user_1 = require("../user/response/response.user");
const dto_profile_signalment_1 = require("./dto/dto.profile_signalment");
const response_profile_signalment_1 = require("./response/response.profile_signalment");
const signalment_service_1 = require("./signalment.service");
let SignalmentController = class SignalmentController {
    constructor(signalmentService) {
        this.signalmentService = signalmentService;
    }
    signalProfile(data, request) {
        return this.signalmentService.signal(data, request.user);
    }
    deleteSignalment(id, request) {
        return this.signalmentService.deleteSignalment(id, request.user);
    }
    getProfileSignalments(offset, request) {
        return this.signalmentService.showSignalments(Number(offset), request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Report' }),
    (0, swagger_1.ApiBody)({ type: dto_profile_signalment_1.ProfileSignalmentDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: response_profile_signalment_1.ProfileSignalmentInfoDTO, isArray: false }),
    (0, common_1.Post)('report'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_profile_signalment_1.ProfileSignalmentDTO, Object]),
    __metadata("design:returntype", void 0)
], SignalmentController.prototype, "signalProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Signalment - Admin Required' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Signalment ID', allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SignalmentController.prototype, "deleteSignalment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get profile signalments' }),
    (0, swagger_1.ApiParam)({ name: 'offset', description: 'Pass 0 to start, then increment in order to get 12 more ', allowEmptyValue: false }),
    (0, swagger_1.ApiResponse)({ type: response_profile_signalment_1.ProfileSignalmentInfoDTO, isArray: true }),
    (0, common_1.Get)('profile/all/:offset'),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SignalmentController.prototype, "getProfileSignalments", null);
SignalmentController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Signalment'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('signalment'),
    __metadata("design:paramtypes", [signalment_service_1.SignalmentService])
], SignalmentController);
exports.SignalmentController = SignalmentController;
//# sourceMappingURL=signalment.controller.js.map