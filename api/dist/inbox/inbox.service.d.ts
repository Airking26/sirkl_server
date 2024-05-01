import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { UserService } from "src/user/user.service";
import { InboxCreationDTO } from "./dto/dto.inbox";
import { Inbox } from "./interface/interface.inbox";
export declare class InboxService {
    private readonly inboxModel;
    private readonly userService;
    constructor(inboxModel: Model<Inbox>, userService: UserService);
    createChannel(inboxCreationDTO: InboxCreationDTO, user: any): Promise<any>;
    updateChannel(user: User): Promise<void>;
    deleteChannels(): Promise<void>;
    deleteInbox(id: string, user: User): Promise<void>;
    getQueryENSForETHAddress(ensAddress: string): string;
    getQueryETHAddressForENS(wallet: string): string;
    queryENSforETHaddress(ensAddress: string): Promise<any>;
    queryEthAddressforENS(wallet: string): Promise<any>;
}
