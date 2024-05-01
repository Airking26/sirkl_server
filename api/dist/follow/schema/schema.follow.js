"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FollowSchema = new mongoose_1.Schema({
    requester: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
//# sourceMappingURL=schema.follow.js.map