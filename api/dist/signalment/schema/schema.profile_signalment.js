"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSignalmentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProfileSignalmentSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    idSignaled: { type: String, required: true },
    type: { type: Number, required: true }
}, { timestamps: true });
//# sourceMappingURL=schema.profile_signalment.js.map