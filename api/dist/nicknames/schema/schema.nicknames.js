"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknamesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NicknamesSchema = new mongoose_1.Schema({
    ownedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Map, of: String, required: true },
});
//# sourceMappingURL=schema.nicknames.js.map