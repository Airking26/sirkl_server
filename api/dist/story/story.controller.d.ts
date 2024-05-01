import { UserInfoDTO } from "src/user/response/response.user";
import { StoryCreationDTO, StoryModificationDTO } from "./dto/story.dto";
import { StoryService } from "./story.service";
export declare class StoryController {
    private readonly storyService;
    constructor(storyService: StoryService);
    createStory(storyCreationDTO: StoryCreationDTO, request: any): Promise<{
        id: string;
        createdBy: UserInfoDTO;
        readers: import("../user/interface/interface.user").User[];
        url: string;
        createdAt: Date;
        type: number;
    }>;
    updateStory(storyModificationDTO: StoryModificationDTO, request: any): Promise<{
        id: string;
        createdBy: UserInfoDTO;
        readers: import("../user/interface/interface.user").User[];
        url: string;
        createdAt: Date;
        type: number;
    }>;
    retrieveStories(offset: any, request: any): Promise<{
        id: string;
        createdBy: UserInfoDTO;
        readers: import("../user/interface/interface.user").User[];
        url: string;
        createdAt: Date;
        type: number;
    }[][]>;
    retrieveMyStories(request: any): Promise<{
        id: string;
        createdBy: UserInfoDTO;
        readers: import("../user/interface/interface.user").User[];
        url: string;
        createdAt: Date;
        type: number;
    }[]>;
    retrieveReadersForStory(id: any, request: any): Promise<UserInfoDTO[]>;
    deleteStory(createdBy: string, id: string, request: any): Promise<void>;
}
