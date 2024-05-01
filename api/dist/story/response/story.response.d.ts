import { User } from "src/user/interface/interface.user";
import { UserInfoDTO } from "src/user/response/response.user";
import { Story } from "../interface/story.interface";
export declare class StoryDTO {
    readonly id: string;
    readonly url: string[];
    readonly createdBy: UserInfoDTO;
    readonly readers: string[];
    readonly createdAt: Date;
    readonly type: number;
}
export declare function formatToStoryDTO(data: Story, user: User): {
    id: string;
    createdBy: UserInfoDTO;
    readers: User[];
    url: string;
    createdAt: Date;
    type: number;
};
export declare function formatMultipleStoryDTO(data: Story[][], user: User): {
    id: string;
    createdBy: UserInfoDTO;
    readers: User[];
    url: string;
    createdAt: Date;
    type: number;
}[][];
export declare function formatMyStories(data: Story[], user: User): {
    id: string;
    createdBy: UserInfoDTO;
    readers: User[];
    url: string;
    createdAt: Date;
    type: number;
}[];
