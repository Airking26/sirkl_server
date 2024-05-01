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
exports.CallController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const dto_inbox_1 = require("../inbox/dto/dto.inbox");
const response_user_1 = require("../user/response/response.user");
const call_service_1 = require("./call.service");
const dto_call_1 = require("./dto/dto.call");
const response_call_1 = require("./response/response.call");
let CallController = class CallController {
    constructor(callService) {
        this.callService = callService;
    }
    followUser(id, channel, request) {
        return this.callService.endACall(channel, request.user, id);
    }
    missedCallNotification(id, request) {
        return this.callService.missedCall(id, request.user);
    }
    createInbox(callCreationDTO, request) {
        return this.callService.createCall(callCreationDTO, request.user);
    }
    updateUser(request, data) {
        return this.callService.updateCallStatus(data, request.user);
    }
    retrieveInboxes(offset, request) {
        return this.callService.retrieveCalls(request.user, Number(offset));
    }
    searchUser(name, request) {
        return this.callService.searchCalls(name, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'End a call' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id', allowEmptyValue: false }),
    (0, swagger_1.ApiParam)({ name: 'channel', description: 'channel id', allowEmptyValue: false }),
    (0, common_1.Get)('end/:id/:channel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)("channel")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "followUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Missed call notification' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id', allowEmptyValue: false }),
    (0, common_1.Get)('missed_call/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "missedCallNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "create a call" }),
    (0, swagger_1.ApiBody)({ type: dto_call_1.CallCreationDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: response_call_1.CallDTO, isArray: false }),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_call_1.CallCreationDTO, Object]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "createInbox", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Modify Call infos" }),
    (0, swagger_1.ApiBody)({ type: dto_call_1.CallModificationDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: response_call_1.CallDTO, isArray: false }),
    (0, common_1.Patch)("update"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_call_1.CallModificationDTO]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve calls" }),
    (0, swagger_1.ApiParam)({ name: "offset", description: "offset", allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_call_1.CallDTO, isArray: true }),
    (0, common_1.Get)("retrieve/:offset"),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "retrieveInboxes", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search user by username or wallet" }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Searched substring' }),
    (0, swagger_1.ApiOkResponse)({ type: response_call_1.CallDTO, isArray: true }),
    (0, common_1.Get)("search/:name"),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CallController.prototype, "searchUser", null);
CallController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Call"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("call"),
    __metadata("design:paramtypes", [call_service_1.CallService])
], CallController);
exports.CallController = CallController;
//# sourceMappingURL=call.controller.js.map