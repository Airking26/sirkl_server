import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { UserInfoDTO } from "src/user/response/response.user";
import { SearchService } from "./search.service";

@ApiBearerAuth()
@ApiTags("Search")
@UseGuards(JwtAuthGuard)
@Controller("search")
export class SearchController{
    constructor(private searchService: SearchService){}

    @ApiOperation({summary: "Search user by username or wallet"})
    @ApiParam({name: 'name', description: 'Searched substring'})
    @ApiParam({name: "offset", description: 'Pass 0 to start, then increment in order to get 12 more users', allowEmptyValue: false})
    @ApiOkResponse({type: UserInfoDTO, isArray: true})
    @Get("users/:name/:offset")
    searchUser(@Param('name') name, @Param('offset') offset, @Req() request){
        return this.searchService.showMatchingUser(name, Number(offset), request.user)
    }
}