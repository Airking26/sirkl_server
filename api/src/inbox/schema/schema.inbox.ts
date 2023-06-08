import { Schema } from "mongoose";

export const InboxSchema = new Schema({
    wallets:      [{type: String, required: true}],
    idChannel: {type: String, required: true},
    createdBy: {type: String, required: true},
    messages:   [{type: String, required: true}]
}, {timestamps: true})