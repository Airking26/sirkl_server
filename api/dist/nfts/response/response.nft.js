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
exports.formatMultipleNftInfoDTO = exports.formatToNFTInfoDTO = exports.NFTInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const interface_user_1 = require("../../user/interface/interface.user");
const response_user_1 = require("../../user/response/response.user");
class NFTInfoDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NFTInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NFTInfoDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], NFTInfoDTO.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NFTInfoDTO.prototype, "collectionImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], NFTInfoDTO.prototype, "contractAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], NFTInfoDTO.prototype, "isFav", void 0);
exports.NFTInfoDTO = NFTInfoDTO;
function formatToNFTInfoDTO(data) {
    const { id, title, images, collectionImage, contractAddress, isFav } = data;
    return {
        id,
        title,
        images,
        collectionImage,
        contractAddress,
        isFav
    };
}
exports.formatToNFTInfoDTO = formatToNFTInfoDTO;
function formatMultipleNftInfoDTO(data) {
    return data.map(it => formatToNFTInfoDTO(it));
}
exports.formatMultipleNftInfoDTO = formatMultipleNftInfoDTO;
//# sourceMappingURL=response.nft.js.map