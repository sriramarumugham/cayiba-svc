import { FavouriteType } from "@/types/favourite.type";
import { SuccessResponseType } from "@/types/response.type";
import { Type } from "@sinclair/typebox";
import { FastifySchema } from "fastify";


export const addFavouriteSchema = {
  tags: ['favourites'],
  body: FavouriteType,
  response: {
        201: SuccessResponseType(),
  },
  security: [{ bearerAuth: [] }],

} satisfies FastifySchema;

export const removeFavouriteSchema = {
  tags: ['favourites'],
  body: FavouriteType,
  response: {

        201: SuccessResponseType(),
    
  },
  security: [{ bearerAuth: [] }],

} satisfies FastifySchema;

export const getUserFavouritesSchema = {
  tags: ['favourites'],
  params: Type.Object({ userId: Type.String() }),
  response: {
    200: SuccessResponseType(Type.Array(FavouriteType)),
  },
  security: [{ bearerAuth: [] }],

} satisfies FastifySchema;
