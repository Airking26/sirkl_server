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
exports.NFTController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const dto_nft_creation_1 = require("./dto/dto.nft_creation");
const nft_service_1 = require("./nft.service");
const response_nft_1 = require("./response/response.nft");
let NFTController = class NFTController {
    constructor(nftService) {
        this.nftService = nftService;
    }
    getAllNfts(request) {
        return this.nftService.getAllNFTs(request.user);
    }
    updateAllNfts(request) {
        return this.nftService.updateNFT(request.user);
    }
    retrieveFavNft(id, favorite, offset, request) {
        return this.nftService.retrieveNFT(request.user, id, Number(offset), favorite);
    }
    updateUser(request, data) {
        return this.nftService.updateNFTStatus(data, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all nfts" }),
    (0, common_1.Get)('retrieveAll'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "getAllNfts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update all nfts" }),
    (0, common_1.Get)('updateAll'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "updateAllNfts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get nfts with offset" }),
    (0, swagger_1.ApiParam)({ name: "id" }),
    (0, swagger_1.ApiParam)({ name: "favorite" }),
    (0, swagger_1.ApiParam)({ name: "offset" }),
    (0, swagger_1.ApiOkResponse)({ type: response_nft_1.NFTInfoDTO, isArray: true }),
    (0, common_1.Get)('retrieve/:id/:favorite/:offset'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("favorite")),
    __param(2, (0, common_1.Param)("offset")),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String, Object]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "retrieveFavNft", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Modify NFT infos" }),
    (0, swagger_1.ApiBody)({ type: dto_nft_creation_1.NFTModificationDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: response_nft_1.NFTInfoDTO, isArray: false }),
    (0, common_1.Patch)("update"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_nft_creation_1.NFTModificationDTO]),
    __metadata("design:returntype", void 0)
], NFTController.prototype, "updateUser", null);
NFTController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("NFT"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("nft"),
    __metadata("design:paramtypes", [nft_service_1.NFTService])
], NFTController);
exports.NFTController = NFTController;
//# sourceMappingURL=nft.controller.js.map