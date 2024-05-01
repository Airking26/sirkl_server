import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
export declare class SearchService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    showMatchingUser(substring: string, offset: number, user: User): Promise<import("src/user/response/response.user").UserInfoDTO[]>;
}
