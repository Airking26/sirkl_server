import { Schema } from 'mongoose';

export const FollowSchema = new Schema ({
    requester:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

