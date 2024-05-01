"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinSchema = void 0;
const mongoose_1 = require("mongoose");
exports.JoinSchema = new mongoose_1.Schema({
    requester: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    channelId: { type: String, required: true },
    channelName: { type: String, required: true }
}, { timestamps: true });
//# sourceMappingURL=schema.request.js.map