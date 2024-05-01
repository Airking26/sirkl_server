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
exports.formatMyStories = exports.formatMultipleStoryDTO = exports.formatToStoryDTO = exports.StoryDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const interface_user_1 = require("../../user/interface/interface.user");
const response_user_1 = require("../../user/response/response.user");
class StoryDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], StoryDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], StoryDTO.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: response_user_1.UserInfoDTO }),
    __metadata("design:type", response_user_1.UserInfoDTO)
], StoryDTO.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], StoryDTO.prototype, "readers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], StoryDTO.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], StoryDTO.prototype, "type", void 0);
exports.StoryDTO = StoryDTO;
function formatToStoryDTO(data, user) {
    const { _id, createdBy, readers, url, createdAt, type } = data;
    return {
        id: _id,
        createdBy: (0, response_user_1.formatToUserDTO)(createdBy, user),
        readers,
        url,
        createdAt,
        type
    };
}
exports.formatToStoryDTO = formatToStoryDTO;
function formatMultipleStoryDTO(data, user) {
    return data.map(it => it.map(e => formatToStoryDTO(e, user)));
}
exports.formatMultipleStoryDTO = formatMultipleStoryDTO;
function formatMyStories(data, user) {
    return data.map(it => formatToStoryDTO(it, user));
}
exports.formatMyStories = formatMyStories;
//# sourceMappingURL=story.response.js.map