"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NotificationSchema = new mongoose_1.Schema({
    type: { type: Number, required: true },
    hasBeenRead: { type: Boolean, required: true },
    picture: { type: String, required: false },
    idData: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    belongTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    eventName: { type: String, required: false },
    message: { type: String, required: false },
    channelId: { type: String, required: false },
    channelName: { type: String, required: false },
    requester: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    paying: { type: Boolean, required: false },
    inviteId: { type: String, required: false },
    channelPrice: { type: String, required: false }
}, { timestamps: true });
exports.NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
//# sourceMappingURL=schema.notification.js.map