import { ErrorResponses, SuccessResponseType } from "@/types/response.type";
import { Type } from "@sinclair/typebox";
import { FastifySchema } from "fastify";

// Schema for dashboard statistics response
export const DashboardStatsResponseSchema = Type.Object({
  totalAdvertisements: Type.Number(),
  activeAdvertisements: Type.Number(),
  deletedAdvertisements: Type.Number(),
  blockedAdvertisements: Type.Number(),
  availableInventory: Type.Number(),
  soldInventory: Type.Number(),
  unlistedInventory: Type.Number(),
});

// Schema for graph data response
export const DashboardGraphResponseSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      date: Type.String(),
      count: Type.Number(),
    })
  ),
});

// Request schema for getting dashboard statistics
export const getDashboardStatsSchema = {
  tags: ["dashboard"],
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(DashboardStatsResponseSchema),
  },
  security: [{ bearerAuth: [] }],
} satisfies FastifySchema;

// Request schema for getting dashboard graph data
export const getDashboardGraphSchema = {
  tags: ["dashboard"],
  querystring: Type.Object({
    period: Type.Optional(
      Type.Union(
        [
          Type.Literal("7d"),
          Type.Literal("30d"),
          Type.Literal("90d"),
          Type.Literal("1y"),
        ],
        { default: "30d" }
      )
    ),
  }),
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(DashboardGraphResponseSchema),
  },
  security: [{ bearerAuth: [] }],
} satisfies FastifySchema;
