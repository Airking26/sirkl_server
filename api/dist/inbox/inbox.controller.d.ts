import { InboxCreationDTO } from "./dto/dto.inbox";
import { InboxService } from "./inbox.service";
export declare class InboxController {
    private readonly inboxService;
    constructor(inboxService: InboxService);
    createInbox(inboxCreationDTO: InboxCreationDTO, request: any): Promise<any>;
    updateInbox(request: any): Promise<void>;
    getEthFromEns(ens: string, request: any): Promise<any>;
    getEnsFromEth(wallet: string, request: any): Promise<any>;
    deleteInbox(id: string, request: any): Promise<void>;
    deleteChannels(request: any): Promise<void>;
}
