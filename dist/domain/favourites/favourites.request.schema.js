"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavouritesSchema = exports.removeFavouriteSchema = exports.addFavouriteSchema = void 0;
const favourite_type_1 = require("../../types/favourite.type");
const response_type_1 = require("../../types/response.type");
const typebox_1 = require("@sinclair/typebox");
exports.addFavouriteSchema = {
    tags: ['favourites'],
    body: favourite_type_1.FavouriteType,
    response: {
        201: (0, response_type_1.SuccessResponseType)(),
    },
    security: [{ bearerAuth: [] }],
};
exports.removeFavouriteSchema = {
    tags: ['favourites'],
    body: favourite_type_1.FavouriteType,
    response: {
        201: (0, response_type_1.SuccessResponseType)(),
    },
    security: [{ bearerAuth: [] }],
};
exports.getUserFavouritesSchema = {
    tags: ['favourites'],
    params: typebox_1.Type.Object({ userId: typebox_1.Type.String() }),
    response: {
        200: (0, response_type_1.SuccessResponseType)(typebox_1.Type.Array(favourite_type_1.FavouriteType)),
    },
    security: [{ bearerAuth: [] }],
};
