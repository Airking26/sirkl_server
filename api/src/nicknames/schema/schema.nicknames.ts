import { Schema } from "mongoose";

export const NicknamesSchema = new Schema({
    ownedBy:    {type: Schema.Types.ObjectId, ref: "User", required: true},
    value:      {type: Map, of: String, required: true},
})