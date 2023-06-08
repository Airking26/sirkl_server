import { timeStamp } from "console";
import { Schema } from "mongoose";

export const NotificationSchema = new Schema({
    type:           {type: Number, required: true},
    hasBeenRead:    {type: Boolean, required: true},
    picture:        {type: String, required: false},
    idData:         {type: Schema.Types.ObjectId, required: true},
    belongTo:       {type: Schema.Types.ObjectId, ref: 'User', required: true},
    username:       {type: String, required: true},
    eventName:      {type: String, required: false},
    message:        {type: String, required: false},
    channelId:      {type: String, required: false},
    channelName:    {type: String, required: false},
    requester:      {type: Schema.Types.ObjectId, required: false}
}, {timestamps: true})
NotificationSchema.index({createdAt: 1}, {expireAfterSeconds: 604800})