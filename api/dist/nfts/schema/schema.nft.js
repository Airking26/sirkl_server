"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NFTSchema = new mongoose_1.Schema({
    ownedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    images: { type: [String], required: true },
    collectionImage: { type: String, required: true, default: "" },
    contractAddress: { type: String, required: true },
    isFav: { type: Boolean, required: true, default: false },
    floorPrice: { type: Number, required: true, default: 0 }
});
//# sourceMappingURL=schema.nft.js.map