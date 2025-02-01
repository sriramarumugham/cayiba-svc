import { Static, Type } from "@sinclair/typebox";

// TypeBox Schema
export const FavouriteType = Type.Object({
  userId: Type.Any(),
  advertismentId: Type.Any(), // Store ObjectId as a string in TypeBox
});

// Type Definition
export type FavouriteDocument = Static<typeof FavouriteType>;

export type FavouriteRequestType = Static<typeof FavouriteType>;