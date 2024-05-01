import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { StoryCreationDTO, StoryModificationDTO } from "./dto/story.dto";
import { Story } from "./interface/story.interface";
export declare class StoryService {
    private readonly storyModel;
    private readonly userModel;
    constructor(storyModel: Model<Story>, userModel: Model<User>);
    createStory(data: StoryCreationDTO, user: User): Promise<{
        id: string;
        createdBy: import("src/user/response/response.user").UserInfoDTO;
        readers: User[];
        url: string;
        createdAt: Date;
        type: number;
    }>;
    modifyStory(data: StoryModificationDTO, user: User): Promise<{
        id: string;
        createdBy: import("src/user/response/response.user").UserInfoDTO;
        readers: User[];
        url: string;
        createdAt: Date;
        type: number;
    }>;
    deleteStory(createdBy: String, id: String, user: User): Promise<void>;
    retrieveMyStories(user: User): Promise<{
        id: string;
        createdBy: import("src/user/response/response.user").UserInfoDTO;
        readers: User[];
        url: string;
        createdAt: Date;
        type: number;
    }[]>;
    retrieveReadersForStory(id: String, user: User): Promise<import("src/user/response/response.user").UserInfoDTO[]>;
    retrieveStories(offset: number, user: User): Promise<{
        id: string;
        createdBy: import("src/user/response/response.user").UserInfoDTO;
        readers: User[];
        url: string;
        createdAt: Date;
        type: number;
    }[][]>;
}
