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
exports.formatMultipleCallDTO = exports.formatToCallDTO = exports.CallDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const interface_user_1 = require("../../user/interface/interface.user");
const interface_call_1 = require("../interface/interface.call");
const response_user_1 = require("../../user/response/response.user");
class CallDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CallDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: response_user_1.UserInfoDTO }),
    __metadata("design:type", response_user_1.UserInfoDTO)
], CallDTO.prototype, "called", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], CallDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CallDTO.prototype, "status", void 0);
exports.CallDTO = CallDTO;
function formatToCallDTO(data, user) {
    const { id, called, updatedAt, status } = data;
    return {
        id,
        called: (0, response_user_1.formatToUserDTO)(called, user),
        updatedAt,
        status
    };
}
exports.formatToCallDTO = formatToCallDTO;
function formatMultipleCallDTO(data, user) {
    return data.map(it => formatToCallDTO(it, user));
}
exports.formatMultipleCallDTO = formatMultipleCallDTO;
//# sourceMappingURL=response.call.js.map