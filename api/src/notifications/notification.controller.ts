import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from 'src/auth/passport/auth_guard';
import { UpdateNotificationDTO } from './dto/dto.notification';
import { NotificationService } from './notification.service';
import { NotificationInfoDTO } from './response/response.notification';
import { NotificationToAllDTO } from 'src/apns/dto/dto.notification_to_all';
import { NotificationAddedOrAdmin } from 'src/apns/dto/dto.notification_added_in_group';

@ApiBearerAuth()
@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
    constructor(private commentService: NotificationService) {}

    @ApiOperation({ summary: 'Get notifications for a given user'})
    @ApiOkResponse({ type: NotificationInfoDTO, isArray: true })
    @Get(':id/notifications/:offset')
    getNotifications(@Param('offset') offset: string, @Param('id') id, @Req() request) {
        return this.commentService.showNotifications(id, request.user, offset);
    }

    @ApiOperation({summary: 'Delete a notification'})
    @ApiOkResponse({ type: NotificationInfoDTO})
    @Delete(':id')
    deleteNotification(@Param('id') id: string, @Req() request){
        return this.commentService.removeNotification(id)
    }

    @ApiOperation({summary: 'Check if user has unread notifications'})
    @ApiOkResponse({type: Boolean})
    @Get(':id/unreadNotif')
    checkUnreadNotification(@Param('id') id: string, @Req() request){
        return this.commentService.hasNotifUnread(id, request)
    }

    @ApiOperation({summary : 'Register notification'})
    @ApiBody({type: NotificationToAllDTO, required: true})
    @Post("register")
    registerNotification(@Req() request, @Body() notif: NotificationToAllDTO){
        return this.commentService.registerNotification(request.user, notif)
    }

    @ApiOperation({summary: "User added in group"})
    @ApiBody({type: NotificationAddedOrAdmin, required: true})
    @Post("added_in_group")
    notifyAddedInGroup(@Req() request, @Body() naoa : NotificationAddedOrAdmin){
        return this.commentService.notifyUserAddedInGroup(request.user, naoa)
    }

    @ApiOperation({summary: "User as admin"})
    @ApiBody({type: NotificationAddedOrAdmin, required: true})
    @Post("upgraded_as_admin")
    notifyUserAsAdmin(@Req() request, @Body() naoa : NotificationAddedOrAdmin){
        return this.commentService.notifyUserAsAdmin(request.user, naoa)
    }

    @ApiOperation({summary: "Notify user invited in paying group"})
    @ApiBody({type: NotificationAddedOrAdmin, required: true})
    @Post("invited_to_join_paying_group")
    notifyUserInvitedToJoinPayingGroup(@Req() request, @Body() naoa: NotificationAddedOrAdmin){
        return this.commentService.notifyUserInvitedToJoinGroup(request.user, naoa)
    }

}