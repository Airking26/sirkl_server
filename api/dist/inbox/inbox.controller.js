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
exports.InboxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const dto_inbox_1 = require("./dto/dto.inbox");
const inbox_service_1 = require("./inbox.service");
let InboxController = class InboxController {
    constructor(inboxService) {
        this.inboxService = inboxService;
    }
    createInbox(inboxCreationDTO, request) {
        return this.inboxService.createChannel(inboxCreationDTO, request.user);
    }
    updateInbox(request) {
        return this.inboxService.updateChannel(request.user);
    }
    getEthFromEns(ens, request) {
        return this.inboxService.queryENSforETHaddress(ens);
    }
    getEnsFromEth(wallet, request) {
        return this.inboxService.queryEthAddressforENS(wallet);
    }
    deleteInbox(id, request) {
        return this.inboxService.deleteInbox(id, request.user);
    }
    deleteChannels(request) {
        return this.inboxService.deleteChannels();
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "create an inbox" }),
    (0, swagger_1.ApiBody)({ type: dto_inbox_1.InboxCreationDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: String }),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_inbox_1.InboxCreationDTO, Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "createInbox", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "update inboxes" }),
    (0, common_1.Get)("update"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "updateInbox", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve ETH address from ENS" }),
    (0, swagger_1.ApiParam)({ name: 'ens' }),
    (0, common_1.Get)("eth_from_ens/:ens"),
    __param(0, (0, common_1.Param)("ens")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "getEthFromEns", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve ENS address from Wallet" }),
    (0, swagger_1.ApiParam)({ name: 'wallet' }),
    (0, common_1.Get)("ens_from_eth/:wallet"),
    __param(0, (0, common_1.Param)("wallet")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "getEnsFromEth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete inbox" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Id channel" }),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "deleteInbox", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'delete channels' }),
    (0, common_1.Delete)("deleteChannels"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "deleteChannels", null);
InboxController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Inbox"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("inbox"),
    __metadata("design:paramtypes", [inbox_service_1.InboxService])
], InboxController);
exports.InboxController = InboxController;
//# sourceMappingURL=inbox.controller.js.map