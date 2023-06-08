import { Schema } from "mongoose";

export const GroupSchema = new Schema({
    name:    {type: String, required: false},
    image:    {type: String, required: false},
    contractAddress:    {type: String, required: false},
},{timestamps: true})