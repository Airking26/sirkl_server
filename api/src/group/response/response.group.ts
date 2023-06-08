import { ApiProperty } from "@nestjs/swagger"
import { Group } from "../interface/interface.group"

export class GroupDTO{

    @ApiProperty({type: String})
    readonly name: string

    @ApiProperty({type: String})
    readonly image: string

    @ApiProperty({type: String})
    readonly contractAddress: string
}

export function formatToGroupDTO(data: Group){
    const {name, image, contractAddress} = data
    return{
        name,
        image,
        contractAddress
    }
}

export function formatMultipleGroupDTO(data: Group[]){
    return data.map(it => formatToGroupDTO(it))
}