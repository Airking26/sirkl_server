import { Schema } from 'mongoose';

export const JoinSchema = new Schema ({
    requester:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    channelId:  { type: String, required: true },
    channelName: {type: String, required: true}
}, { timestamps: true });
