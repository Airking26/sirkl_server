import { GroupService } from "./group.service";
import { GroupCreationDTO } from "./dto/dto.group";
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
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
