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
exports.UpdateUserInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserInfoDTO {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserInfoDTO.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserInfoDTO.prototype, "picture", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserInfoDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserInfoDTO.prototype, "hasSBT", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Map }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Map)
], UpdateUserInfoDTO.prototype, "nicknames", void 0);
exports.UpdateUserInfoDTO = UpdateUserInfoDTO;
//# sourceMappingURL=dto.update_user.js.map