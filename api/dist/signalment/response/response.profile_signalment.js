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
exports.formatToProfileSignalmentDTO = exports.ProfileSignalmentInfoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const interface_user_1 = require("../../user/interface/interface.user");
const response_user_1 = require("../../user/response/response.user");
class ProfileSignalmentInfoDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ProfileSignalmentInfoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: response_user_1.UserInfoDTO, description: 'User signaling the profile' }),
    __metadata("design:type", response_user_1.UserInfoDTO)
], ProfileSignalmentInfoDTO.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Id signaled' }),
    __metadata("design:type", String)
], ProfileSignalmentInfoDTO.prototype, "idSignaled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Type (0 = conversation or profile, 1 = group, 2 = community)" }),
    __metadata("design:type", Number)
], ProfileSignalmentInfoDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Signalment description' }),
    __metadata("design:type", String)
], ProfileSignalmentInfoDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Creation date' }),
    __metadata("design:type", Date)
], ProfileSignalmentInfoDTO.prototype, "createdAt", void 0);
exports.ProfileSignalmentInfoDTO = ProfileSignalmentInfoDTO;
function formatToProfileSignalmentDTO(data, user) {
    return { id: data.id, idSignaled: data.idSignaled, createdBy: (0, response_user_1.formatToUserDTO)(user, user), description: data.description, createdAt: data.createdAt, type: data.type };
}
exports.formatToProfileSignalmentDTO = formatToProfileSignalmentDTO;
//# sourceMappingURL=response.profile_signalment.js.map