"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteType = void 0;
const typebox_1 = require("@sinclair/typebox");
// TypeBox Schema
exports.FavouriteType = typebox_1.Type.Object({
    userId: typebox_1.Type.Any(),
    advertismentId: typebox_1.Type.Any(), // Store ObjectId as a string in TypeBox
});
