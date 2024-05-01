import { Model } from "mongoose";
import { Group } from "./interface/interface.group";
import { GroupCreationDTO } from "./dto/dto.group";
export declare class GroupService {
    private readonly groupModel;
    constructor(groupModel: Model<Group>);
    createGroup(groupCreationDTO: GroupCreationDTO): Promise<{
        name: string;
        image: string;
        contractAddress: string;
    }>;
    retrieveGroups(): Promise<{
        name: string;
        image: string;
        contractAddress: string;
    }[]>;
}
