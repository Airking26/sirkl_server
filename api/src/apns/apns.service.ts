import { Injectable } from "@nestjs/common";
import Apn from 'apn';
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../certs/service-account.json';

@Injectable()
export class ApnsService {
  private firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  async pushNotifications(messages) {
    const requests = messages.map(async (message) => {
      if (!message.token) {
        console.error("Error: Message is missing a token.");
        return;
      }

      try {
        const response = await admin.messaging().send(message);
        console.log(response);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    return Promise.all(requests);
  }

  callInvitationApn(userCalling, channel, voipToken, userCalled, callId) {
    const title = "Call Incoming";
    const body = userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(userCalling.wallet.length - 4)} is calling you`;
    const pic = userCalling.picture || '';
    
    const provider = new Apn.Provider({
      token: {
        key: path.resolve(__dirname, "..", "..", "..", "certs", "AuthKey_SC5SCPP57W.p8"),
        keyId: process.env.VOIP_KEY_ID,
        teamId: process.env.VOIP_TEAM_ID,
      },
      production: true
    });

    const id = uuidv4();
    const uuid = uuidv4();

    const notification = new Apn.Notification({
      rawPayload: {
        aps: {
          alert: { title, body },
          mutableContent: true,
          contentAvailable: true,
          apnsPushType: "background"
        },
        handle: body,
        pic,
        called_id: userCalled,
        call_id: callId,
        type: "voip",
        caller_name: userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(userCalling.wallet.length - 4)}`,
        caller_id: userCalling.id,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        channel,
        uuid,
        id,
      },
      topic: "io.airking.sirkl.voip",
      priority: 5
    });

    provider.send(notification, voipToken).then((res) => {
      console.log(res.failed ? JSON.stringify(res.failed) : JSON.stringify(res.sent));
    });
  }

  callInvitationIOS(userCalling, channel, fcmToken, userCalled, callId) {
    const title = userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(userCalling.wallet.length - 4)} is calling you`;
    const pic = userCalling.picture || '';
    const uuid = uuidv4();

    const message = fcmToken.map((token) => ({
      token,
      notification: { title, body: "Call Incoming" },
      data: {
        title,
        body: "Call Incoming",
        call_id: callId,
        called_id: userCalled,
        caller_id: userCalling.id,
        caller_name: userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(userCalling.wallet.length - 4)}`,
        pic,
        uuid,
        channel,
      }
    }));
    
    this.pushNotifications(message);
  }

  callInvitationAndroid(userCalling, channel, fcmToken, userCalled, callId) {
    const title = userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(0, 6)}`;
    const pic = userCalling.picture || '';
    const uuid = uuidv4();

    const message = fcmToken.map((token) => ({
      token,
      data: {
        title,
        body: "Call Incoming",
        type: "8",
        call_id: callId,
        called_id: userCalled,
        caller_id: userCalling.id,
        caller_name: userCalling.userName || `${userCalling.wallet.substring(0, 6)}...${userCalling.wallet.substring(userCalling.wallet.length - 4)}`,
        pic,
        uuid,
        channel,
      },
      android: { priority: "high" },
      webpush: { headers: { Urgency: "high" } }
    }));

    this.pushNotifications(message);
  }

  declineCallIOS(channelId, fcmToken) {
    const message = fcmToken.map((token) => ({
      token,
      data: {
        title: "Sirkl",
        body: "Call ended",
        type: "2",
        channel_id: channelId
      }
    }));

    this.pushNotifications(message);
  }

  declineCallAndroid(channelId, fcmToken) {
    const message = fcmToken.map((token) => ({
      token,
      data: {
        title: "Sirkl",
        body: "Call ended",
        type: "2",
        channel_id: channelId
      },
      android: { priority: "high" },
      webpush: { headers: { Urgency: "high" } }
    }));

    this.pushNotifications(message);
  }

  missedCallIOS(user, fcmToken) {
    const title = "Missed call";
    const body = user.userName ? `${user.userName} tried to call you` : `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)} tried to call you`;

    const message = fcmToken.map((token) => ({
      token,
      notification: { title, body },
      data: { title, body, type: "3" }
    }));

    this.pushNotifications(message);
  }

  missedCallAndroid(user, fcmToken) {
    const title = "Missed call";
    const body = user.userName ? `${user.userName} tried to call you` : `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)} tried to call you`;

    const message = fcmToken.map((token) => ({
      token,
      notification: { title, body },
      data: { title, body, type: "3" }
    }));

    this.pushNotifications(message);
  }

  addedByUserIOS(user, fcmToken) {
    const title = "Sirkl";
    const body = user.userName ? `${user.userName} added you in his SIRKL` : `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)} added you in his SIRKL`;
    const pic = user.picture || '';

    const message = fcmToken.map((token) => ({
      token,
      notification: { title, body},
      data: { title, body, type: "0", username: user.userName || `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)}`, id: user.id, picture: pic }
    }));

    this.pushNotifications(message);
  }

  addedByUserAndroid(user, fcmToken) {
    const title = "Sirkl";
    const body = user.userName ? `${user.userName} added you in his SIRKL` : `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)} added you in his SIRKL`;
    const pic = user.picture || '';

    const message = fcmToken.map((token) => ({
      token,
      notification: { title, body},
      data: { title, body, type: "0", username: user.userName || `${user.wallet.substring(0, 6)}...${user.wallet.substring(user.wallet.length - 4)}`, id: user.id, picture: pic }
    }));

    this.pushNotifications(message);
  }


userAddedInGroupAndroid(user, fcmToken, groupId, body) {
  const title = "Sirkl";
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "5",
          id: groupId,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}

userAddedInGroupIOS(user, fcmToken, groupId, body) {
  const title = "Sirkl";
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "5",
          id: groupId,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}

userAddedAsAdminAndroid(user, fcmToken, groupName, groupId) {
  const title = "Sirkl";
  const body = `${user.userName || (user.wallet.substring(0, 6) + "..." + user.wallet.substring(user.wallet.length - 4))} upgraded you to admin in group ${groupName}`;
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "6",
          id: groupId,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}


userAddedAsAdminIOS(user, fcmToken, groupName, groupId) {
  const title = "Sirkl";
  const body = `${user.userName || (user.wallet.substring(0, 6) + "..." + user.wallet.substring(0, 6))} upgraded you to admin in group ${groupName}`;
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "6",
          id: groupId,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}

receiveRequestToJoinGroupIOS(user, fcmToken, groupName) {
  const title = "Sirkl";
  const body = `${user.userName || (user.wallet.substring(0, 6) + "..." + user.wallet.substring(user.wallet.length - 4))} has requested to join ${groupName}`;
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "7",
          id: user.id,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}

receiveRequestToJoinGroupAndroid(user, fcmToken, groupName) {
  const title = "Sirkl";
  const body = `${user.userName || (user.wallet.substring(0, 6) + "..." + user.wallet.substring(user.wallet.length - 4))} has requested to join ${groupName}`;
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "7",
          id: user.id,
          picture: pic,
      }
  }));

  this.pushNotifications(message);
}

userInvitedToJoinGroup(user, fcmToken, body, groupId) {
  const title = "Sirkl";
  const pic = user.picture || '';

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "8",
          id: groupId,
          picture: pic,
      },
  }));

  this.pushNotifications(message);
}

async sendMintNotificationSucceed(fcmToken) {
  const title = "Successful Mint";
  const body = "You're now part of the SIRKL SBT community!";
  const pictureUrl = "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png";
  const groupId = "0x2B2535Ba07Cd144e143129DcE2dA4f21145a5011".toLowerCase();

  const message = fcmToken.map((token) => ({
      token,
      notification: {
          title,
          body,
      },
      data: {
          title,
          body,
          type: "9",
          id: groupId,
          picture: pictureUrl,
      }
  }));

  this.pushNotifications(message);
}

  // Similarly, refactor other methods following the pattern above
}

export default ApnsService;