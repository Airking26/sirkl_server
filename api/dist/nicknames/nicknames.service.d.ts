import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { Nicknames } from "./interface/interface.nicknames";
export declare class NicknamesService {
    private readonly nicknamesModel;
    constructor(nicknamesModel: Model<Nicknames>);
    retrieveNicknames(user: User): Promise<any>;
    addNickname(user: User, wallet: string, nickname: string): Promise<Map<String, String>>;
}
