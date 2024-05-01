import { Schema } from "mongoose";
import { FCMTokenPlatform } from "../../apns/interface/interface.fcm-tokens";

export const FCMTokenSchema = new Schema({
  platform: { type: FCMTokenPlatform, required: false },
  token: { type: String, required: false },
});

export const UserSchema = new Schema(
  {
    userName: { type: String, required: false, default: "" },
    picture: { type: String, required: false },
    fcmTokens: [
      {
        platform: { type: FCMTokenPlatform, required: false },
        token: { type: String, required: false },
      },
    ],
    isAdmin: { type: Boolean, required: false, default: false },
    description: { type: String, required: false, default: "" },
    fcmToken: { type: String, required: false, default: null },
    wallet:   { type: String, required: false, default: ""},
    nicknames: {type: Map, of: String, required: false, default: {}},
    following: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    apnToken : {type: String, required: false, default: null},
    platformCreated : {type: String, required: false, default: null},
    platformUpdated : {type: String, required: false, default: null},
    hasSBT: {type: Boolean, required: false, default: false}
  },
  { timestamps: true }
);
