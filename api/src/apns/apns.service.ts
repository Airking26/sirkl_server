import { BadRequestException, Injectable } from "@nestjs/common";
import FCM from "fcm-node";
import Apn from 'apn'
import path from "path";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ApnsService {
  private fcm = new FCM(process.env.FIREBASE_SERVER_KEY);

 pushNotifications(message) {
    const requests = message.map((m) =>
      this.fcm.send(m, (err, response) => {
        if (err) {
          console.error(err);
        } else {
          console.log(response);
        }
      })
    );
  }

  callInvitationApn(userCalling, channel, voipToken, userCalled, callId){
    const title = "Call Incoming"
    const body = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you'
    const pic = userCalling.picture
    let provider = new Apn.Provider({
      token: {
        key: path.join(__dirname, "..", "..", "certs", "AuthKey_SC5SCPP57W.p8"),
        keyId: process.env.VOIP_KEY_ID,
        teamId: process.env.VOIP_TEAM_ID,
    },
    production: true
    })

    const id = uuidv4()
    const uuid= uuidv4()

    let notification = new Apn.Notification()
    
    notification.rawPayload = {
      aps: {
        alert: {
          title: title,
          body: body,
        },
        mutableContent: true,
        contentAvailable: true,
        apnsPushType: "background"
    },
    handle: body,
    pic: pic,
    called_id: userCalled,
    call_id: callId,
    type: "voip",
    caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
    caller_id: userCalling.id,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    channel: channel,
    uuid: uuid,
    id: id,
    }

    console.log("id : " + id)
    console.log("uuid : " + uuid)
    notification.topic = "io.airking.sirkl.voip"
    notification.priority = 5
    provider.send(notification, voipToken).then((res) => {
      if(res.failed) return console.log(JSON.stringify(res.failed))
      return console.log(JSON.stringify(res.sent))
    })

  }

  callInvitationIOS(userCalling, channel, fcmToken, userCalled, callId){
    const uuid= uuidv4()
    const body = "Call Incoming"
    const title = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you'
    const pic = userCalling.picture
    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification:{
          title,
          body,
          call_id: callId,
          called_id: userCalled,
          caller_id : userCalling.id,
          caller_name: userCalling.username == "" ?  (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
          pic: pic,
          uuid: uuid,
          channel: channel,
        },
        data: {
          title,
          body,
          call_id: callId,
          called_id: userCalled,
          caller_id : userCalling.id,
          caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
          pic: pic,
          uuid: uuid,
          channel: channel,
        }
      }
    })
    this.pushNotifications(message)
  }

  callInvitationAndroid(userCalling, channel, fcmToken, userCalled, callId){
    const uuid= uuidv4()
    const body = "Call Incoming"
    const title = userCalling.userName == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) + ' is calling you' : userCalling.userName + ' is calling you'
    const pic = userCalling.picture
    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {},
        data: {
          title,
          body,
          type: 8,
          call_id: callId,
          called_id: userCalled,
          caller_id : userCalling.id,
          caller_name: userCalling.username == "" ? (userCalling.wallet.substring(0, 6) + "..." + (userCalling.wallet.substring(userCalling.wallet.length - 4))) : userCalling.userName,
          pic: pic,
          uuid: uuid,
          channel: channel,
        },
        "priority": 10,
        "android":{
          "priority":"high"
        },
        "webpush": {
          "headers": {
            "Urgency": "high"
          }
        },
      }
    })
    this.pushNotifications(message)
  }

  declineCallIOS(channelId, fcmToken){
    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification:{
          title: "",
          body: "",
          type: 2,
          channel_id: channelId
        },
        data:{
          title: "Sirkl",
          body: "Call ended",
          type: 2,
          channel_id: channelId
        }
      }
    })
    this.pushNotifications(message)
  }

  declineCallAndroid(channelId, fcmToken){
    const message = fcmToken.map((token) => {
      return {
        to: token,
        data:{
          title: "Sirkl",
          body: "Call ended",
          type: 2,
          channel_id: channelId
        },
        "priority": 10,
        "android":{
          "priority":"high"
        },
        "webpush": {
          "headers": {
            "Urgency": "high"
          }
        },
      }
    })
    this.pushNotifications(message)
  }

  missedCallIOS(user, fcmToken){
    const title = "Missed call"
    const body = user.userName != "" ? user.userName + " tried to call you" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " tried to call you";
    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification:{
          title,
          body,
          type: 3,
        },
        data:{
          title,
          body,
          type: 3,
        }
      }
    })
    this.pushNotifications(message)
  }

  missedCallAndroid(user, fcmToken){
    const title = "Missed call"
    const body = user.userName != "" ? user.userName + " tried to call you" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " tried to call you";
    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification:{
          title,
          body,
          type: 3,
        },
        data: {
          title,
          body,
          type: 3,
        }
      }
    })
    this.pushNotifications(message)
  }

  addedByUserIOS(user, fcmToken) {
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " added you in his SIRKL" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4)))+ " added you in his SIRKL";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 0,
          username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 0,
          username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

  addedByUserAndroid(user, fcmToken) {
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " added you in his SIRKL" : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " added you in his SIRKL";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
                    title: title,
          body: body,
          type: 0,
          username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 0,
          username: user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        }
      };
    });
    this.pushNotifications(message);
  }


  userAddedInSirkl(user, fcmToken) {
    const title = "Sirkl";
    const body = + "You have added "+ user.userName != "" ? user.userName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4)))  + " in your SIRKL";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {},
        data: {
          title: title,
          body: body,
          type: 1,
          username: user.userName  == "" ?? (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))),
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

  sendNotificationToAllUsers(data, user){
    if(!user.isAdmin) throw new BadRequestException("USER_NOT_ADMIN")
    const title = "SIRKL.io";
    const body = data.message;
     
    const message = {
        to: "/topics/all",
        'data': {
          'title': title,
          'body': body,
          'type': 4,
          'id': "63f78a6188f7d4001f68699a",
          'picture' : "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png"
        },
        "priority": 10,
        "android":{
          "priority":"high"
        },
        "webpush": {
          "headers": {
            "Urgency": "high"
          }
        },
        'notification': {
          'title': title,
          'body': body,
          'type': 4,
          'id': "63f78a6188f7d4001f68699a",
          'picture' : "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png"
        }
    }

    this.fcm.send(message, (err, response) => {
      if (err) {
        console.error(err);
      } else {
        console.log(response);
      }
    })
  
  }

  userAddedInGroupAndroid(user, fcmToken, groupId, body){
    const title = "Sirkl";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 5,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 5,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        }
      };
    });
    this.pushNotifications(message);
  }

  userAddedInGroupIOS(user, fcmToken, groupId, body){
    const title = "Sirkl";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 5,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 5,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

  userAddedAsAdminAndroid(user, fcmToken, groupName, groupId){
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " upgraded you as admin in group " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " upgraded you as admin in group " + groupName;
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 6,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 6,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        }
      };
    });
    this.pushNotifications(message);
  }

  userAddedAsAdminIOS(user, fcmToken, groupName, groupId){
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " upgraded you as admin in group " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " upgraded you as admin in group " + groupName;
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 6,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 6,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

  receiveRequestToJoinGroupIOS(user, fcmToken, groupName){
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " has requested to join " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + groupName;
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 7,
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 7,
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

  receiveRequestToJoinGroupAndroid(user, fcmToken, groupName){
    const title = "Sirkl";
    const body = user.userName != "" ? user.userName + " has requested to join " + groupName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + groupName;
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 7,
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        }, 
        data: {
          title: title,
          body: body,
          type: 7,
          id: user.id,
          picture: pic,
          fcmToken: fcmToken,
        }
      };
    });
    this.pushNotifications(message);
  }

  userInvitedToJoinGroup(user, fcmToken, body, groupId){
    const title = "Sirkl";
    const pic = user.picture;

    const message = fcmToken.map((token) => {
      return {
        to: token,
        notification: {
          title: title,
          body: body,
          type: 8,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
        data: {
          title: title,
          body: body,
          type: 8,
          id: groupId,
          picture: pic,
          fcmToken: fcmToken,
        },
      };
    });
    this.pushNotifications(message);
  }

}
