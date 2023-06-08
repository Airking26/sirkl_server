import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/interface/interface.user";
import { Call } from "src/call/interface/interface.call";
import { formatToUserDTO, UserInfoDTO } from "src/user/response/response.user";

export class CallDTO{

    @ApiProperty({type: String})
    readonly id: string

    @ApiProperty({type: UserInfoDTO})
    readonly called: UserInfoDTO

    @ApiProperty({type: Date})
    readonly updatedAt: Date
    
    @ApiProperty({type: Number})
    readonly status: number
}

export function formatToCallDTO(data: Call, user: User){
    const {id, called, updatedAt, status} = data;
    return{
        id,
        called : formatToUserDTO(called, user),
        updatedAt,
        status
    }
}

export function formatMultipleCallDTO(data: Call[], user: User){
    return data.map(it => formatToCallDTO(it, user))
}