import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { UserInfoDTO } from "src/user/response/response.user";
import { JoinService } from "./request.service";
import { JoinDTO } from "./dto/dto.request";

@ApiBearerAuth()
@ApiTags('Join')
@UseGuards(JwtAuthGuard)
@Controller('join')
export class JoinController{
    constructor(private joinService: JoinService) {}

    @ApiOperation({summary: "Request to join a private group"})
    @ApiBody({type: JoinDTO, required: true})
    @Post("request_to_join")
    notifyAddedInGroup(@Req() request, @Body() joinDTO : JoinDTO){
        return this.joinService.createRequestToJoinPrivateGroup(joinDTO, request.user)
    }

    @ApiOperation({ summary: 'Retrieve requests to join private group'})
    @ApiOkResponse({ type: UserInfoDTO, isArray: true })
    @ApiParam({name: 'id', description: 'channel wanted'})
    @Get('requests/:id')
    getFollowingUsers(@Param('id') channelId, @Req() request) {
        return this.joinService.retrieveRequests(channelId, request.user);
    }

    @ApiOperation({summary: "Accept or decline the request"})
    @ApiBody({type: JoinDTO, required: true})
    @Post("accept_decline_request")
    acceptOrDeclineRequest(@Req() request, @Body() joinDTO : JoinDTO){
        return this.joinService.acceptDeclineRequest(joinDTO, request.user)
    }
}