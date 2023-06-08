import { Schema } from "mongoose";

export const CallSchema = new Schema({
    ownedBy:    {type: Schema.Types.ObjectId, ref: 'User', required: true},
    status:     {type: Number, required: true},
    updatedAt:  {type: Date, required: true},
    called:      {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true})