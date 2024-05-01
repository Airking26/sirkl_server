"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CallSchema = new mongoose_1.Schema({
    ownedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Number, required: true },
    updatedAt: { type: Date, required: true },
    called: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
//# sourceMappingURL=schema.call.js.map