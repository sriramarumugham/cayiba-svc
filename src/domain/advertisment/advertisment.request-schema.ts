import { AdvertismentType, CreateAdvertismentRequestDocument } from "@/types";
import { ErrorResponses, SuccessResponseType } from "@/types/response.type";
import { Type } from "@sinclair/typebox";
import { FastifySchema } from "fastify";
import {
  AdvertisementWithUserTypeAlt,
  SearchProductType,
  searchRequestDocument,
  UpdateInventoryDocument,
} from "../../types/advertisment.type";
import { generateSchemaDescription } from "@/utils/helpers";
import {
  PaginatedResponseSchema,
  PaginationQuerySchema,
} from "@/types/pagination.type";

export const createAdvertismentRequestSchema = {
  tags: ["advertisment"],
  response: {
    ...ErrorResponses,
    201: SuccessResponseType(),
  },
  description: `This API requires form data. Upload the images and other fields in form data. \n\nSchema:\n${generateSchemaDescription(
    AdvertismentType
  )}`,
} satisfies FastifySchema;

export const updateAdvertismentInverntorySchema = {
  tags: ["advertisment"],
  body: UpdateInventoryDocument,
  response: {
    ...ErrorResponses,
    201: SuccessResponseType(),
  },
} satisfies FastifySchema;

export const getAdvertismentByStatusSchema = {
  tags: ["advertisment"],
  security: [{ bearerAuth: [] }],
  querystring: Type.Intersect([
    PaginationQuerySchema,
    Type.Object({
      status: Type.String(), // Add valid advertisement statuses
    }),
  ]),
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(PaginatedResponseSchema(AdvertismentType)),
  },
} satisfies FastifySchema;

export const blockAdvertismentSchema = {
  tags: ["advertisment"],
  params: Type.Object({
    advertismentId: Type.String(), // Advertisement ID to block
  }),
  response: {
    ...ErrorResponses,
    201: SuccessResponseType(),
  },
} satisfies FastifySchema;

export const getPublishedAdvertisementsSchema = {
  tags: ["advertisment"],
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(Type.Array(AdvertismentType)),
  },
} satisfies FastifySchema;

export const deleteAdvertismentSchema = {
  tags: ["advertisment"],
  params: Type.Object({
    id: Type.String(), // Expecting the advertisement ID as a path parameter
  }),
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(Type.Array(AdvertismentType)),
  },
} satisfies FastifySchema;

// search
export const searchRequestSchema = {
  tags: ["search"],
  querystring: searchRequestDocument,
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(Type.Array(SearchProductType)),
  },
} satisfies FastifySchema;

export const getAdvertismentByIdRequestSchema = {
  tags: ["search"], // Updated tag
  params: Type.Object({ id: Type.String() }),
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(AdvertisementWithUserTypeAlt),
  },
} satisfies FastifySchema;
