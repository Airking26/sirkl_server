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
exports.GroupController = void 0;
const swagger_1 = require("@nestjs/swagger");
const group_service_1 = require("./group.service");
const response_group_1 = require("./response/response.group");
const auth_guard_1 = require("../auth/passport/auth_guard");
const common_1 = require("@nestjs/common");
const dto_group_1 = require("./dto/dto.group");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    createGroup(groupCreationDTO) {
        return this.groupService.createGroup(groupCreationDTO);
    }
    retrieveGroups() {
        return this.groupService.retrieveGroups();
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({ type: response_group_1.GroupDTO, isArray: false }),
    (0, swagger_1.ApiBody)({ type: dto_group_1.GroupCreationDTO, required: true }),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_group_1.GroupCreationDTO]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: response_group_1.GroupDTO, isArray: true }),
    (0, common_1.Get)("retrieve"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "retrieveGroups", null);
GroupController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Group"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("group"),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map