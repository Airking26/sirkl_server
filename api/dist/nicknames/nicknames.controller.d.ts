import { NicknameCreationDTO } from "./dto/dto.nickname";
import { NicknamesService } from "./nicknames.service";
export declare class NicknamesController {
    private readonly nicknamesService;
    constructor(nicknamesService: NicknamesService);
    retrieveInboxes(request: any): Promise<any>;
    updateInbox(nicknameCreationDTO: NicknameCreationDTO, wallet: string, request: any): Promise<Map<String, String>>;
}
