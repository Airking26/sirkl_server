import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { formatMultipleUsersDTO } from "src/user/response/response.user";

@Injectable()
export class SearchService{

    constructor(@InjectModel("User") private readonly userModel : Model<User>){}

    async showMatchingUser(substring: string, offset: number, user: User): Promise<any> {
        const limit = user.isAdmin ? 50 : 12;
        const regex = new RegExp(substring.replace(' ', ''), 'i');
    
        const users = await this.userModel.aggregate([
            {
                $match: {
                    $and: [
                        { wallet: { $ne: user.wallet } },
                        {
                            $or: [
                                { userName: { $regex: regex } },
                                { userName: { $regex: substring, $options: 'i' } },
                                { wallet: { $regex: regex } },
                                { wallet: { $regex: substring, $options: 'i' } },
                            ]
                        }
                    ]
                }
            },
            {
                $addFields: {
                    startsWithSubstring: {
                        $cond: {
                            if: {
                                $or: [
                                    { $regexMatch: { input: "$userName", regex: `^${substring.replace(' ', '')}`, options: 'i' } },
                                    { $regexMatch: { input: "$wallet", regex: `^${substring.replace(' ', '')}`, options: 'i' } }
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    },
                    id: "$_id"
                }
            },
            { $sort: { startsWithSubstring: -1 } },
            { $skip: offset * limit },
            { $limit: limit }
        ]).exec();
    
        return formatMultipleUsersDTO(users, user);
    }
}