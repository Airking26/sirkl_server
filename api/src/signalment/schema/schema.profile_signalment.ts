import { Schema } from "mongoose";

export const ProfileSignalmentSchema = new Schema({
    createdBy:      {type: Schema.Types.ObjectId, ref: 'User', required: true},
    description:    {type: String, required: true},
    idSignaled:   {type: String, required: true},
    type:           {type: Number, required: true}
}, {timestamps: true})