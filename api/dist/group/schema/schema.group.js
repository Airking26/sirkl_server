"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GroupSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    image: { type: String, required: false },
    contractAddress: { type: String, required: false },
}, { timestamps: true });
//# sourceMappingURL=schema.group.js.map