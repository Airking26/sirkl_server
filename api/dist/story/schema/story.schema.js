"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.StorySchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: false },
    readers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    type: { type: Number, required: true, default: 0 }
}, { timestamps: true });
exports.StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
//# sourceMappingURL=story.schema.js.map