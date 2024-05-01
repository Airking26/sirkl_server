import { UserInfoDTO } from "src/user/response/response.user";
import { SearchService } from "./search.service";
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    searchUser(name: any, offset: any, request: any): Promise<UserInfoDTO[]>;
}
