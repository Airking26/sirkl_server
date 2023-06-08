import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { formatMultipleUsersDTO } from "src/user/response/response.user";

@Injectable()
export class SearchService{

    constructor(@InjectModel("User") private readonly userModel : Model<User>){}

    async showMatchingUser(substring: string, offset: number, user: User){
        var l = user.isAdmin ? 50 : 12
        const users = await this.userModel.find({$or: [
            {userName: {$regex: substring.replace(' ', ''), $options: 'i'}},
            {userName: {$regex: substring, $options: 'i'}},
            {wallet: {$regex: substring.replace(' ', ''), $options: 'i'}},
            {wallet: {$regex: substring, $options: 'i'}},
            //{$text: {$search: substring}}
        ]})
        //.sort({score:{$meta:"textScore"}})
        .sort({"wallet": -1})
        .skip(offset * l).limit(l)
        return formatMultipleUsersDTO(users, user)
    }
}