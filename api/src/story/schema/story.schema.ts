import { Schema } from "mongoose";

export const StorySchema = new Schema({
    createdBy:       {type: Schema.Types.ObjectId, ref: 'User', required: true},
    url:      {type: String, required: false},
    readers:  [{type: Schema.Types.ObjectId, ref: 'User'}],
    type: {type: Number, required: true, default: 0}
}, {timestamps: true})
StorySchema.index({createdAt: 1}, {expireAfterSeconds: 86400})