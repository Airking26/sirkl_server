import { BadRequestException, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { formatMultipleUsersDTO } from "src/user/response/response.user";
import { StoryCreationDTO, StoryModificationDTO } from "./dto/story.dto";
import { Story } from "./interface/story.interface";
import { formatMultipleStoryDTO, formatMyStories, formatToStoryDTO } from "./response/story.response";

@Injectable()
export class StoryService{
    constructor(
        @InjectModel('Story') private readonly storyModel: Model<Story>,
        @InjectModel('User') private readonly userModel: Model<User>){}


    async createStory(data: StoryCreationDTO, user: User){
        const story = await new this.storyModel({createdBy: user, url: data.url, type: data.type}).save()
        return formatToStoryDTO(story, user)
    }

    async modifyStory(data: StoryModificationDTO, user: User){
        const story = await this.storyModel.findByIdAndUpdate(data.id, {$addToSet: {readers: data.readers}}, {new: true, useFindAndModify: false}).populate({path: 'createdBy'})
        return formatToStoryDTO(story, user)
    }

    async deleteStory(createdBy: String, id: String, user: User){
        if(createdBy != user.id) throw new BadRequestException("NOT_THE_OWNER")
        await this.storyModel.findByIdAndDelete(id)
    }

    async retrieveMyStories(user: User){
        const stories = await this.storyModel.find({createdBy : user}).sort({"createdAt": -1})
        await this.userModel.populate(stories, {path: 'createdBy'});
        return formatMyStories(stories, user)
    }

    async retrieveReadersForStory(id: String, user: User){
        const story = await this.storyModel.findById(id).populate({path: 'readers'})
        const readers = story.readers
        return formatMultipleUsersDTO(readers, user)
    }

    async retrieveStories(offset: number, user: User){
        const userFollowing = await this.userModel.findById(user.id)
        const arraysOfStories = await this.storyModel.aggregate([
            {$match: 
                {$or: [
                    { createdBy: {$in : userFollowing.following}},
                    { createdBy: user.id}
                ]}
            },
            {$sort: {createdAt: -1}},
            {$group: { 
                _id: "$createdBy",
                data: { $push: '$$ROOT' },
                count: { $sum: 1 }
            }},
            {
                $project: {
                  _id: 0,
                  data: 1,
                  count: 1,
                }
              },
            {$skip: offset * 12},
            {$limit: 12}
        ]).sort({"data.createdAt": -1})
        await this.userModel.populate(arraysOfStories, {path: 'data.createdBy'});
        return formatMultipleStoryDTO(arraysOfStories.map(it => it.data), user)
    }

}