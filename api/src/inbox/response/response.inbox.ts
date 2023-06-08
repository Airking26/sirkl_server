import { ApiProperty } from "@nestjs/swagger";
import exp from "constants";
import { User } from "src/user/interface/interface.user";
import { formatMultipleUsersDTO, UserInfoDTO } from "src/user/response/response.user";
import { Inbox } from "../interface/interface.inbox";

/*export class InboxDTO{

    @ApiProperty({type: String})
    readonly id: string

    @ApiProperty({type: String})
    readonly lastMessage: string

    @ApiProperty({type: String})
    readonly lastSender: string

    @ApiProperty({type: Number})
    readonly unreadMessages: number

    @ApiProperty({type: Date})
    readonly updatedAt: Date

    @ApiProperty({type: UserInfoDTO, isArray: true})
    readonly ownedBy: UserInfoDTO[]

}

export function formatToInboxDTO(data: Inbox, user: User){
    const {id,  ownedBy} = data
    return {
        id,
        lastMessage,
        lastSender,
        unreadMessages,
        updatedAt,
        ownedBy: formatMultipleUsersDTO(ownedBy, user)
    }
}

export function formatMultipleInboxDTO(data: Inbox[], user: User){
    return data.map(it => formatToInboxDTO(it, user))
}*/