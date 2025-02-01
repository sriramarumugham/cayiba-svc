import { FavouriteDocument } from "@/types/favourite.type";
import mongoose, { Schema } from "mongoose";

const FavouriteSchema: Schema<FavouriteDocument> = new Schema(
  {
    userId: { type: String, required: true}, 
    advertismentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Advertisment' }, 
  },
  { timestamps: true }
);

const FavouriteModel = mongoose.model<FavouriteDocument>('Favourite', FavouriteSchema)

export default FavouriteModel;
