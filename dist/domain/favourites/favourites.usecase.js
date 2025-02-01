"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavourites = exports.removeFavourite = exports.addFavourite = void 0;
const favourites_schema_1 = __importDefault(require("../../data-access/models/favourites.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const addFavourite = async (userId, advertismentId) => {
    const existingFavourite = await favourites_schema_1.default.findOne({ userId, advertismentId });
    if (existingFavourite) {
        throw { status: 400, message: 'Advertisement is already in favourites!' };
    }
    return favourites_schema_1.default.create({ userId, advertismentId: new mongoose_1.default.Types.ObjectId(advertismentId) });
};
exports.addFavourite = addFavourite;
const removeFavourite = async (userId, advertismentId) => {
    const existingFavourite = await favourites_schema_1.default.findOne({ userId, advertismentId });
    if (!existingFavourite) {
        throw { status: 400, message: 'Advertisement is not in favourites!' };
    }
    return favourites_schema_1.default.findOneAndDelete({ userId, advertismentId });
};
exports.removeFavourite = removeFavourite;
const getUserFavourites = (userId) => favourites_schema_1.default.find({ userId }).populate('advertismentId');
exports.getUserFavourites = getUserFavourites;
