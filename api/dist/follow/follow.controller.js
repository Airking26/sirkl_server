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
exports.FollowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/passport/auth_guard");
const response_user_1 = require("../user/response/response.user");
const follow_service_1 = require("./follow.service");
let FollowController = class FollowController {
    constructor(followService) {
        this.followService = followService;
    }
    followUser(id, request) {
        return this.followService.follow(request.user, id);
    }
    unfollowUser(id, request) {
        return this.followService.unfollow(request.user, id);
    }
    getFollowingUsers(id, request) {
        return this.followService.showFollowingUsers(id, request.user);
    }
    searchInFollowing(offset, name, request) {
        return this.followService.searchInFollowing(request.user, name, Number(offset));
    }
    checkUserIsInFollowing(userID, request) {
        return this.followService.isInFollowing(userID, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Follow a public user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id', allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: false }),
    (0, common_1.Put)('me/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "followUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Unfollow a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id', allowEmptyValue: false }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'SUCCESS' }),
    (0, common_1.Delete)('me/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "unfollowUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get following users' }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: true }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'user wanted' }),
    (0, common_1.Get)(':id/following'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "getFollowingUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search following users by userName' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'The string to search in username', allowEmptyValue: false }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pass 0 to start, then increment in order to get 12 more users', allowEmptyValue: false }),
    (0, swagger_1.ApiOkResponse)({ type: response_user_1.UserInfoDTO, isArray: true }),
    (0, common_1.Get)('search/following/:name/:offset'),
    __param(0, (0, common_1.Param)('offset')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "searchInFollowing", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if user is in following' }),
    (0, swagger_1.ApiParam)({ name: 'userID', allowEmptyValue: false }),
    (0, common_1.Get)('isInFollowing/:userID'),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "checkUserIsInFollowing", null);
FollowController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Follow'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('follow'),
    __metadata("design:paramtypes", [follow_service_1.FollowService])
], FollowController);
exports.FollowController = FollowController;
//# sourceMappingURL=follow.controller.js.map