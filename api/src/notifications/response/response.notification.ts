import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { User } from "src/user/interface/interface.user";
import { Notification } from "../interface/interface.notification";

export class NotificationInfoDTO{
    @ApiProperty({type: String})
    readonly id: string

    @ApiProperty({type: Date})
    readonly createdAt: Date

    @ApiProperty({type: Boolean})
    readonly hasBeenRead: boolean

    @ApiProperty({type: String})
    readonly picture: string

    @ApiProperty({type: Number})
    readonly type: number

    @ApiProperty({type: String})
    readonly belongTo: string

    @ApiProperty({type: String})
    readonly username: string

    @ApiProperty({type: String})
    readonly idData: string

    @ApiPropertyOptional({type: String})
    readonly eventName: string

    @ApiPropertyOptional({type: String})
    readonly message: string

    @ApiPropertyOptional({type: String})
    readonly channelId: string

    @ApiPropertyOptional({type: String})
    readonly channelName: string
    
    @ApiPropertyOptional({type: String})
    readonly requester: string
}

export function formatToNotificationInfoDTO(notification: Notification, user: User): NotificationInfoDTO{
    const {id, createdAt, hasBeenRead, type, picture, belongTo, username, idData, eventName, message, channelId, channelName, requester} = notification
    return {id, createdAt, hasBeenRead, type , picture, belongTo, username, idData, eventName, message, channelId, channelName, requester}
}

export function formatMulitpleNotificationInfoDTO(notifications: Notification[], user: User): NotificationInfoDTO[]{
    return notifications.map(it => formatToNotificationInfoDTO(it, user))
}

export class NotificationResultDTO{
    @ApiProperty({type: NotificationInfoDTO, isArray: true})
    @Type(() => NotificationInfoDTO)
    @IsArray({})
    @ValidateNested({each: true})
    readonly notifications: NotificationInfoDTO[]
}