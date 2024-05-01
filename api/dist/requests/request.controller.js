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
exports.JoinController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const response_user_1 = require("../user/response/response.user");
const request_service_1 = require("./request.service");
const dto_request_1 = require("./dto/dto.request");
let JoinController = class JoinController {
    constructor(joinService) {
        this.joinService = joinService;
    }
    notifyAddedInGroup(request, joinDTO) {
        return this.joinService.createRequestToJoinPrivateGroup(joinDTO, request.user);
    }
    getFollowingUsers(channelId, request) {
        return this.joinService.retrieveRequests(channelId, request.user);
    }
    acceptOrDeclineRequest(request, joinDTO) {
        return this.joinService.acceptDeclineRequest(joinDTO, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Request to join a private group" }),
    (0, swagger_1.ApiBody)({ type: dto_request_1.JoinDTO, required: true }),
    (0, common_1.Post)("request_to_join"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_request_1.JoinDTO]),
    __metadata("design:returntype", void 0)
], JoinController.prototype, "notifyAddedInGroup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve requests to join private group' }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: true }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'channel wanted' }),
    (0, common_1.Get)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], JoinController.prototype, "getFollowingUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Accept or decline the request" }),
    (0, swagger_1.ApiBody)({ type: dto_request_1.JoinDTO, required: true }),
    (0, common_1.Post)("accept_decline_request"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_request_1.JoinDTO]),
    __metadata("design:returntype", void 0)
], JoinController.prototype, "acceptOrDeclineRequest", null);
JoinController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Join'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('join'),
    __metadata("design:paramtypes", [request_service_1.JoinService])
], JoinController);
exports.JoinController = JoinController;
//# sourceMappingURL=request.controller.js.map