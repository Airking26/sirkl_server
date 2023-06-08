import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group } from "./interface/interface.group";
import { BadRequestException } from "@nestjs/common";
import { formatMultipleGroupDTO, formatToGroupDTO } from "./response/response.group";
import { GroupCreationDTO } from "./dto/dto.group";

@Injectable()
export class GroupService{
    constructor(@InjectModel("Group") private readonly groupModel: Model<Group>){}

    async createGroup(groupCreationDTO: GroupCreationDTO){
        const find = await this.groupModel.findOne({name: groupCreationDTO.name, image: groupCreationDTO.picture, contractAddress: groupCreationDTO.contractAddress})
        if(!find){
        const group = await new this.groupModel({name: groupCreationDTO.name, image: groupCreationDTO.picture, contractAddress: groupCreationDTO.contractAddress}).save()
        if(!group) throw new BadRequestException("GROUP_NOT_CREATED")
        return formatToGroupDTO(group)
        } else return null
    }

    async retrieveGroups(){
        const res = await this.groupModel.find()
        if (!res) throw new BadRequestException('CANT_RETRIEVE_GROUPS');
        return formatMultipleGroupDTO(res)
    }
}