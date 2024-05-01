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
exports.formatMultipleGroupDTO = exports.formatToGroupDTO = exports.GroupDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class GroupDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], GroupDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], GroupDTO.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], GroupDTO.prototype, "contractAddress", void 0);
exports.GroupDTO = GroupDTO;
function formatToGroupDTO(data) {
    const { name, image, contractAddress } = data;
    return {
        name,
        image,
        contractAddress
    };
}
exports.formatToGroupDTO = formatToGroupDTO;
function formatMultipleGroupDTO(data) {
    return data.map(it => formatToGroupDTO(it));
}
exports.formatMultipleGroupDTO = formatMultipleGroupDTO;
//# sourceMappingURL=response.group.js.map