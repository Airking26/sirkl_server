import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Mongoose} from 'mongoose';
import {Follow} from "./interface/interface.follow";
import {User} from "../user/interface/interface.user";
import {formatMultipleUsersDTO, formatToUserDTO} from "../user/response/response.user";
import { ApnsService } from 'src/apns/apns.service';
import mongoose from 'mongoose';
import path from 'path';
import { FCMTokenPlatform } from 'src/apns/interface/interface.fcm-tokens';

@Injectable()
export class FollowService{
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Follow') private readonly followModel: Model<Follow>,
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    private readonly apnsService: ApnsService) {}

    async follow(user: User, userId: string) {
        const u = await this.userModel.populate(user, "following")
        if (u.following.map(it => it.id).includes(userId)) {
            throw new BadRequestException('USER_ALREADY_FOLLOWED');
        }

        const data = await new this.followModel({ recipient: userId, requester: user.id}).save();
        if (!data) {
            throw new BadRequestException('CANT_SAVE_FOLLOWING REQUEST');
        }
        const me = await this.userModel.findByIdAndUpdate(user.id, {$addToSet : {following: userId}}, {new: true, useFindAndModify: false}).exec();
        if (!me) {
            throw new BadRequestException('CANT_UPDATE_YOUR_FOLLOWERS');
        }
        const him = await this.userModel.findById(userId)

        new this.notificationModel({hasBeenRead: false, type: 0, idData: me.id, picture: me.picture, belongTo: him.id, username: me.userName != "" ? me.userName :  me.wallet}).save()     
        new this.notificationModel({hasBeenRead: true, type: 1, idData: him.id, picture: him.picture, belongTo: me.id, username: him.userName != "" ? him.userName :  him.wallet}).save()     
        if(him.fcmTokens.length > 0){
        if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.addedByUserAndroid(me, him.fcmTokens.map(it => it.token))
        else this.apnsService.addedByUserIOS(me, him.fcmTokens.map(it => it.token));
        }
       return formatToUserDTO(him, me);
    }

    async unfollow(user: User, userId: string) {
        const u = await this.userModel.populate(user, "following")
        if (!u.following.map(it => it.id).includes(userId))  {
            throw new BadRequestException('USER_ALREADY_NOT_FOLLOWED');
        }

        const userToLocate = await this.userModel.findById(userId);
        const remove = await this.followModel.findOneAndRemove({ recipient : userToLocate, requester : user }).exec();
        if (!remove) {
            throw new BadRequestException('CANT_REMOVE_FOLLOWING_REQUEST');
        }

        const me = await this.userModel.findByIdAndUpdate(user.id, {$pull: {following: userId}}, {new: true, useFindAndModify: false}).exec();
        if (!me) {
            throw new BadRequestException('CANT_UPDATE_YOUR_FOLLOWERS');
        }
        const him = await this.userModel.findByIdAndUpdate(userId, {$pull: {followers: user.id}}, {new: true, useFindAndModify: false}).exec();
        if (!him) {
            throw new BadRequestException('CANT_UPDATE_HIS_FOLLOWERS');
        }
        return formatToUserDTO(him, me);
    }

    async showFollowingUsers(userID: string, user: User) {
        const userToLocate = await this.userModel.findById(userID);
        const res = await this.followModel.find({requester: userToLocate});
        if (!res) {
            throw new BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        }
        const recipients = await this.followModel.populate(res, {path: 'recipient'});
        return formatMultipleUsersDTO(recipients.map(it => it.recipient), user);
    }

    async isInFollowing(userID: string, user){
        return user.following.includes(userID);
    }

    async searchInFollowing(user: User, name: string, offset: number) {
        const u = await this.userModel.populate(user, 'following');
        if (!u) {
            throw new BadRequestException('ERROR_FETCHING_FOLLOWERS');
        }

        const res = u.following.filter(item => item.userName.includes(name));
        const users = res.filter((x,i)=>{if (i>((offset * 12) - 1)){return true}}).filter((x,i)=>{if(i<=(12 - 1)){return true}});
        return formatMultipleUsersDTO(users, user);
    }
}