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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_2 = require("@nestjs/common");
const response_group_1 = require("./response/response.group");
let GroupService = class GroupService {
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    async createGroup(groupCreationDTO) {
        const find = await this.groupModel.findOne({ name: groupCreationDTO.name, image: groupCreationDTO.picture, contractAddress: groupCreationDTO.contractAddress });
        if (!find) {
            const group = await new this.groupModel({ name: groupCreationDTO.name, image: groupCreationDTO.picture, contractAddress: groupCreationDTO.contractAddress }).save();
            if (!group)
                throw new common_2.BadRequestException("GROUP_NOT_CREATED");
            return (0, response_group_1.formatToGroupDTO)(group);
        }
        else
            return null;
    }
    async retrieveGroups() {
        const res = await this.groupModel.find();
        if (!res)
            throw new common_2.BadRequestException('CANT_RETRIEVE_GROUPS');
        return (0, response_group_1.formatMultipleGroupDTO)(res);
    }
};
GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("Group")),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map