import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { UserInfoDTO } from "src/user/response/response.user";
import { FollowService } from "./follow.service";

@ApiBearerAuth()
@ApiTags('Follow')
@UseGuards(JwtAuthGuard)
@Controller('follow')
export class FollowController{
    constructor(private followService: FollowService) {}

    @ApiOperation({ summary: 'Follow a public user'})
    @ApiParam({name: 'id', description: 'User id', allowEmptyValue: false})
    @ApiOkResponse({ type: UserInfoDTO, isArray: false })
    @Put('me/:id')
    followUser(@Param('id') id: string, @Req() request) {
        return this.followService.follow(request.user, id);
    }

    @ApiOperation({ summary: 'Unfollow a user'})
    @ApiParam({name: 'id', description: 'User id', allowEmptyValue: false})
    @ApiNoContentResponse({ description: 'SUCCESS'})
    @Delete('me/:id')
    unfollowUser(@Param('id') id: string, @Req() request) {
        return this.followService.unfollow(request.user, id);
    }

    @ApiOperation({ summary: 'Get following users'})
    //@ApiParam({name: 'offset', description: 'Pass 0 to start, then increment in order to get 12 more users', allowEmptyValue: false})
    @ApiOkResponse({ type: UserInfoDTO, isArray: true })
    @ApiParam({name: 'id', description: 'user wanted'})
    @Get(':id/following')
    getFollowingUsers(@Param('id') id, @Req() request) {
        return this.followService.showFollowingUsers(id, request.user);
    }

    @ApiOperation({ summary: 'Search following users by userName'})
    @ApiParam({name: 'name', description: 'The string to search in username', allowEmptyValue: false})
    @ApiParam({name: 'id', description: 'Pass 0 to start, then increment in order to get 12 more users', allowEmptyValue: false})
    @ApiOkResponse({ type: UserInfoDTO, isArray: true })
    @Get('search/following/:name/:offset')
    searchInFollowing(@Param('offset') offset, @Param('name') name, @Req() request) {
        return this.followService.searchInFollowing(request.user, name, Number(offset))
    }  
    
    @ApiOperation({ summary: 'Check if user is in following'})
    @ApiParam({name: 'userID', allowEmptyValue: false})
    @Get('isInFollowing/:userID')
    checkUserIsInFollowing(@Param('userID') userID, @Req() request) {
        return this.followService.isInFollowing(userID, request.user);
    }

}
