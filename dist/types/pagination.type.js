"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseSchema = exports.PaginationInfoSchema = exports.PaginationQuerySchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.PaginationQuerySchema = typebox_1.Type.Object({
    page: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1, default: 1 })),
    limit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1, maximum: 100, default: 10 })),
    search: typebox_1.Type.Optional(typebox_1.Type.String()),
    sortBy: typebox_1.Type.Optional(typebox_1.Type.String()),
    sortOrder: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("asc"), typebox_1.Type.Literal("desc")], { default: "desc" })),
});
exports.PaginationInfoSchema = typebox_1.Type.Object({
    totalDocs: typebox_1.Type.Number(),
    limit: typebox_1.Type.Number(),
    totalPages: typebox_1.Type.Number(),
    page: typebox_1.Type.Number(),
    pagingCounter: typebox_1.Type.Number(),
    hasPrevPage: typebox_1.Type.Boolean(),
    hasNextPage: typebox_1.Type.Boolean(),
    prevPage: typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()]),
    nextPage: typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()]),
});
const PaginatedResponseSchema = (dataSchema) => typebox_1.Type.Object({
    docs: typebox_1.Type.Array(dataSchema),
    ...exports.PaginationInfoSchema.properties,
});
exports.PaginatedResponseSchema = PaginatedResponseSchema;
