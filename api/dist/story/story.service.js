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
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const response_user_1 = require("../user/response/response.user");
const story_response_1 = require("./response/story.response");
let StoryService = class StoryService {
    constructor(storyModel, userModel) {
        this.storyModel = storyModel;
        this.userModel = userModel;
    }
    async createStory(data, user) {
        const story = await new this.storyModel({ createdBy: user, url: data.url, type: data.type }).save();
        return (0, story_response_1.formatToStoryDTO)(story, user);
    }
    async modifyStory(data, user) {
        const story = await this.storyModel.findByIdAndUpdate(data.id, { $addToSet: { readers: data.readers } }, { new: true, useFindAndModify: false }).populate({ path: 'createdBy' });
        return (0, story_response_1.formatToStoryDTO)(story, user);
    }
    async deleteStory(createdBy, id, user) {
        if (createdBy != user.id)
            throw new common_1.BadRequestException("NOT_THE_OWNER");
        await this.storyModel.findByIdAndDelete(id);
    }
    async retrieveMyStories(user) {
        const stories = await this.storyModel.find({ createdBy: user }).sort({ "createdAt": -1 });
        await this.userModel.populate(stories, { path: 'createdBy' });
        return (0, story_response_1.formatMyStories)(stories, user);
    }
    async retrieveReadersForStory(id, user) {
        const story = await this.storyModel.findById(id).populate({ path: 'readers' });
        const readers = story.readers;
        return (0, response_user_1.formatMultipleUsersDTO)(readers, user);
    }
    async retrieveStories(offset, user) {
        const userFollowing = await this.userModel.findById(user.id);
        const arraysOfStories = await this.storyModel.aggregate([
            { $match: { $or: [
                        { createdBy: { $in: userFollowing.following } },
                        { createdBy: user.id }
                    ] }
            },
            { $sort: { createdAt: -1 } },
            { $group: {
                    _id: "$createdBy",
                    data: { $push: '$$ROOT' },
                    count: { $sum: 1 }
                } },
            {
                $project: {
                    _id: 0,
                    data: 1,
                    count: 1,
                }
            },
            { $skip: offset * 12 },
            { $limit: 12 }
        ]).sort({ "data.createdAt": -1 });
        await this.userModel.populate(arraysOfStories, { path: 'data.createdBy' });
        return (0, story_response_1.formatMultipleStoryDTO)(arraysOfStories.map(it => it.data), user);
    }
};
StoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Story')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], StoryService);
exports.StoryService = StoryService;
//# sourceMappingURL=story.service.js.map