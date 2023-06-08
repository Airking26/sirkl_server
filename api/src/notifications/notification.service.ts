import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, mongo} from 'mongoose';
import { use } from "passport";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO } from "src/user/response/response.user";
import { Notification } from "./interface/interface.notification";
import { formatMulitpleNotificationInfoDTO, formatToNotificationInfoDTO } from "./response/response.notification";
import { ApnsService } from "src/apns/apns.service";

@Injectable()
export class NotificationService{
    constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly apnsService: ApnsService){}

    async showNotifications(belongTo: string, user: User, offset){
        const res = await this.notificationModel.find({belongTo: belongTo}).sort({createdAt: 'descending'}).skip(offset * 12)
        .limit(12).exec();

        if (!res) {
            throw new BadRequestException('CANT_RETRIEVE_NOTIFICATIONS');
        }
        await this.notificationModel.updateMany({belongTo: belongTo},{hasBeenRead: true}, {new: true, useFindAndModify: false, multi: true}).exec()
        return formatMulitpleNotificationInfoDTO(res, user)
    }

    async removeNotification(idNotification: string){
        const res = await this.notificationModel.findByIdAndDelete(idNotification)
        if(!res){
            throw new BadRequestException('CANT_RETRIEVE_NOTIFICATION')
        }
        return res
    }

    async hasNotifUnread(belongTo: string, user: User){
        const res = await this.notificationModel.find({belongTo: belongTo, hasBeenRead: false}).exec()
        if(res.length > 0) return true 
        else return false
    }

    async registerNotification(user, data){
        const res = await new this.notificationModel({hasBeenRead: false, type: 4, idData: "63f78a6188f7d4001f68699a", picture: "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png", belongTo: user.id, username: "SIRKL.io", message: data.message}).save()     
        return
    }

    async notifyUserAddedInGroup(me, data){
        const body = me.userName != "" ? me.userName + " added you in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " added you in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser)
        new this.notificationModel({hasBeenRead: false, type: 5, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName :  me.wallet, message: body}).save()     
        if(him.fcmTokens.length > 0){
            if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.userAddedInGroupAndroid(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel)
            else this.apnsService.userAddedInGroupIOS(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel)
            }
    }

    async notifyUserAsAdmin(me, data){
        const body = me.userName != "" ? me.userName + " upgraded you as admin in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " upgraded you as admin in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser)
        new this.notificationModel({hasBeenRead: false, type: 6, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName :  me.wallet, message : body}).save()     
        if(him.fcmTokens.length > 0){
            if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.userAddedAsAdminAndroid(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel)
            else this.apnsService.userAddedAsAdminIOS(me, him.fcmTokens.map(it => it.token),data.channelName, data.idChannel)
            }
    } 
}