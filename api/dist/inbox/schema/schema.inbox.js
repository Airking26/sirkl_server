"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxSchema = void 0;
const mongoose_1 = require("mongoose");
exports.InboxSchema = new mongoose_1.Schema({
    wallets: [{ type: String, required: true }],
    idChannel: { type: String, required: true },
    createdBy: { type: String, required: true },
    messages: [{ type: String, required: true }]
}, { timestamps: true });
//# sourceMappingURL=schema.inbox.js.map