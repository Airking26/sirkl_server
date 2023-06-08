import { BadRequestException, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { Nicknames } from "./interface/interface.nicknames";

@Injectable()
export class NicknamesService{
    constructor(@InjectModel('Nicknames') private readonly nicknamesModel: Model<Nicknames>){}

    async retrieveNicknames(user: User){
        let res;
        res = await this.nicknamesModel.findOne({ownedBy: user});
        if (!res) res = await new this.nicknamesModel({ownedBy: user.id, value: {}}).save();
        return res.value;
       // return formatMultipleInboxDTO(res, user)
    }

    async addNickname(user: User, wallet: string, nickname: string){
        const res = await this.nicknamesModel.findOne({ownedBy: user})
        res.value.set(wallet, nickname)
        res.save()
        return res.value;
    }
}
