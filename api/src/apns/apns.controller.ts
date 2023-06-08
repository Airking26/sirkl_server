import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { ApnsService } from "./apns.service";
import { NotificationToAllDTO } from "./dto/dto.notification_to_all";

@ApiBearerAuth()
@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class ApnsController{
    constructor(private apnService: ApnsService) {}

    @ApiOperation({summary: "Send notification to all users (Admin Level)"})
    @ApiBody({type: NotificationToAllDTO, required: true})
    @Post("create")
    sendNotificationToAllUsers(@Body() notificationToAllDTO : NotificationToAllDTO, @Req() request){
        return this.apnService.sendNotificationToAllUsers(notificationToAllDTO, request.user)
    }  
}