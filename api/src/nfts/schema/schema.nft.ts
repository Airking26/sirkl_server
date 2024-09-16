import { Schema } from "mongoose";

export const NFTSchema = new Schema({
    ownedBy:            {type: Schema.Types.ObjectId, ref: "User", required: true},
    title:              {type: String, required: true},
    images:             {type: [String], required: true},
    collectionImage:    {type: String, required: true, default: ""},
    contractAddress:    {type: String, required: true},
    isFav:              {type: Boolean, required: true, default: false},
    floorPrice:         {type: Number, required: true, default: 0},
    isNft:              {type: Boolean, required: true, default: true},
    subtitle:           {type: String, required: false},
    chain:              {type: String, required: true, default: 'Ethereum'}
})