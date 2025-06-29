import { getUUID } from "@/utils/uuid.util";
import mongoose, { Schema } from "mongoose";
import {
  AdvertismentDocument,
  E_INVENTORY_STATUS,
  E_STATUS,
} from "../../types";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const AdvertismentSchema: Schema<AdvertismentDocument> = new Schema(
  {
    advertismentId: { type: String, rquired: true, default: getUUID },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    views: { type: Number, default: 0 },
    categoryName: { type: String, required: true },
    categoryId: { type: String, required: true },
    subcategoryName: { type: String, required: true },
    subcategoryId: { type: String, required: true },
    price: { type: String },
    images: [{ type: String }],
    city: { type: String, required: true },
    zip: { type: String, required: true },
    address: { type: String, required: true },
    createdBy: { type: String, required: true },
    status: { type: String, default: E_STATUS.ACTIVE, required: true },
    inventoryDetails: {
      type: String,
      default: E_INVENTORY_STATUS.AVAILABLE,
      required: true,
    },
    productDetails: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

AdvertismentSchema.plugin(mongooseAggregatePaginate);

interface AdvertismentModelType extends mongoose.Model<AdvertismentDocument> {
  aggregatePaginate: (
    aggregate: mongoose.Aggregate<any>,
    options: any
  ) => Promise<any>;
}

const AdvertismentModel = mongoose.model<
  AdvertismentDocument,
  AdvertismentModelType
>("Advertisment", AdvertismentSchema);
export default AdvertismentModel;
