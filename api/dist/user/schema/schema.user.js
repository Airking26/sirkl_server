"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.FCMTokenSchema = void 0;
const mongoose_1 = require("mongoose");
const interface_fcm_tokens_1 = require("../../apns/interface/interface.fcm-tokens");
exports.FCMTokenSchema = new mongoose_1.Schema({
    platform: { type: interface_fcm_tokens_1.FCMTokenPlatform, required: false },
    token: { type: String, required: false },
});
exports.UserSchema = new mongoose_1.Schema({
    userName: { type: String, required: false, default: "" },
    picture: { type: String, required: false },
    fcmTokens: [
        {
            platform: { type: interface_fcm_tokens_1.FCMTokenPlatform, required: false },
            token: { type: String, required: false },
        },
    ],
    isAdmin: { type: Boolean, required: false, default: false },
    description: { type: String, required: false, default: "" },
    fcmToken: { type: String, required: false, default: null },
    wallet: { type: String, required: false, default: "" },
    nicknames: { type: Map, of: String, required: false, default: {} },
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    apnToken: { type: String, required: false, default: null },
    platformCreated: { type: String, required: false, default: null },
    platformUpdated: { type: String, required: false, default: null },
    hasSBT: { type: Boolean, required: false, default: false }
}, { timestamps: true });
//# sourceMappingURL=schema.user.js.map