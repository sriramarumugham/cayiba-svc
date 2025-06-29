"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardGraphSchema = exports.getDashboardStatsSchema = exports.DashboardGraphResponseSchema = exports.DashboardStatsResponseSchema = void 0;
const response_type_1 = require("../../types/response.type");
const typebox_1 = require("@sinclair/typebox");
// Schema for dashboard statistics response
exports.DashboardStatsResponseSchema = typebox_1.Type.Object({
    totalAdvertisements: typebox_1.Type.Number(),
    activeAdvertisements: typebox_1.Type.Number(),
    deletedAdvertisements: typebox_1.Type.Number(),
    blockedAdvertisements: typebox_1.Type.Number(),
    availableInventory: typebox_1.Type.Number(),
    soldInventory: typebox_1.Type.Number(),
    unlistedInventory: typebox_1.Type.Number(),
});
// Schema for graph data response
exports.DashboardGraphResponseSchema = typebox_1.Type.Object({
    data: typebox_1.Type.Array(typebox_1.Type.Object({
        date: typebox_1.Type.String(),
        count: typebox_1.Type.Number(),
    })),
});
// Request schema for getting dashboard statistics
exports.getDashboardStatsSchema = {
    tags: ["dashboard"],
    response: {
        ...response_type_1.ErrorResponses,
        200: (0, response_type_1.SuccessResponseType)(exports.DashboardStatsResponseSchema),
    },
    security: [{ bearerAuth: [] }],
};
// Request schema for getting dashboard graph data
exports.getDashboardGraphSchema = {
    tags: ["dashboard"],
    querystring: typebox_1.Type.Object({
        period: typebox_1.Type.Optional(typebox_1.Type.Union([
            typebox_1.Type.Literal("7d"),
            typebox_1.Type.Literal("30d"),
            typebox_1.Type.Literal("90d"),
            typebox_1.Type.Literal("1y"),
        ], { default: "30d" })),
    }),
    response: {
        ...response_type_1.ErrorResponses,
        200: (0, response_type_1.SuccessResponseType)(exports.DashboardGraphResponseSchema),
    },
    security: [{ bearerAuth: [] }],
};
