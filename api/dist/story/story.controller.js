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
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const response_user_1 = require("../user/response/response.user");
const story_dto_1 = require("./dto/story.dto");
const story_response_1 = require("./response/story.response");
const story_service_1 = require("./story.service");
let StoryController = class StoryController {
    constructor(storyService) {
        this.storyService = storyService;
    }
    createStory(storyCreationDTO, request) {
        return this.storyService.createStory(storyCreationDTO, request.user);
    }
    updateStory(storyModificationDTO, request) {
        return this.storyService.modifyStory(storyModificationDTO, request.user);
    }
    retrieveStories(offset, request) {
        return this.storyService.retrieveStories(Number(offset), request.user);
    }
    retrieveMyStories(request) {
        return this.storyService.retrieveMyStories(request.user);
    }
    retrieveReadersForStory(id, request) {
        return this.storyService.retrieveReadersForStory(id, request.user);
    }
    deleteStory(createdBy, id, request) {
        return this.storyService.deleteStory(createdBy, id, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "create a story" }),
    (0, swagger_1.ApiBody)({ type: story_dto_1.StoryCreationDTO, required: true }),
    (0, swagger_1.ApiOkResponse)({ type: story_response_1.StoryDTO, isArray: false }),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [story_dto_1.StoryCreationDTO, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "createStory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "update a story" }),
    (0, swagger_1.ApiBody)({ type: story_dto_1.StoryModificationDTO, required: true }),
    (0, common_1.Patch)("modify"),
    (0, swagger_1.ApiOkResponse)({ type: story_response_1.StoryDTO, isArray: false }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [story_dto_1.StoryModificationDTO, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "updateStory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve stories" }),
    (0, swagger_1.ApiParam)({ name: 'offset' }),
    (0, common_1.Get)("others/:offset"),
    __param(0, (0, common_1.Param)("offset")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "retrieveStories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve my stories" }),
    (0, swagger_1.ApiOkResponse)({ type: story_response_1.StoryDTO, isArray: true }),
    (0, common_1.Get)("mine"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "retrieveMyStories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "retrieve readers for story" }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: true }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, common_1.Get)("readers/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "retrieveReadersForStory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "delete story" }),
    (0, swagger_1.ApiOkResponse)({ type: story_response_1.StoryDTO, isArray: false }),
    (0, swagger_1.ApiParam)({ name: "createdBy" }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, common_1.Delete)("mine/:createdBy/:id"),
    __param(0, (0, common_1.Param)("createdBy")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "deleteStory", null);
StoryController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Story"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("story"),
    __metadata("design:paramtypes", [story_service_1.StoryService])
], StoryController);
exports.StoryController = StoryController;
//# sourceMappingURL=story.controller.js.map