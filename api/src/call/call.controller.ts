import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { InboxCreationDTO } from "src/inbox/dto/dto.inbox";
import { UserInfoDTO } from "src/user/response/response.user";
import { CallService } from "./call.service";
import { CallCreationDTO, CallModificationDTO } from "./dto/dto.call";
import { CallDTO } from "./response/response.call";

@ApiBearerAuth()
@ApiTags("Call")
@UseGuards(JwtAuthGuard)
@Controller("call")
export class CallController{
    constructor(private readonly callService: CallService){}

    @ApiOperation({ summary: 'End a call'})
    @ApiParam({name: 'id', description: 'User id', allowEmptyValue: false})
    @ApiParam({name: 'channel', description: 'channel id', allowEmptyValue: false})
    @Get('end/:id/:channel')
    followUser(@Param('id') id: string, @Param("channel") channel: string, @Req() request) {
        return this.callService.endACall(channel,request.user, id);
    }


    @ApiOperation({ summary: 'Missed call notification'})
    @ApiParam({name: 'id', description: 'User id', allowEmptyValue: false})
    @Get('missed_call/:id')
    missedCallNotification(@Param('id') id: string, @Req() request) {
        return this.callService.missedCall(id,request.user);
    }

    @ApiOperation({summary: "create a call"})
    @ApiBody({type: CallCreationDTO, required: true})
    @ApiOkResponse({type: CallDTO, isArray: false})
    @Post("create")
    createInbox(@Body() callCreationDTO: CallCreationDTO, @Req() request){
        return this.callService.createCall(callCreationDTO, request.user)
    }

    @ApiOperation({ summary: "Modify Call infos" })
    @ApiBody({ type: CallModificationDTO, required: true })
    @ApiOkResponse({ type: CallDTO, isArray: false })
    @Patch("update")
    updateUser(@Req() request, @Body() data: CallModificationDTO) {
        return this.callService.updateCallStatus(data, request.user);
    }

    @ApiOperation({summary: "retrieve calls"})
    @ApiParam({ name: "offset", description: "offset", allowEmptyValue: false })
    @ApiOkResponse({type: CallDTO, isArray: true})
    @Get("retrieve/:offset")
    retrieveInboxes(@Param('offset') offset, @Req() request){
        return this.callService.retrieveCalls(request.user, Number(offset))
    }

    @ApiOperation({summary: "Search user by username or wallet"})
    @ApiParam({name: 'name', description: 'Searched substring'})
    @ApiOkResponse({type: CallDTO, isArray: true})
    @Get("search/:name")
    searchUser(@Param('name') name, @Req() request){
        return this.callService.searchCalls(name, request.user)
    }
}