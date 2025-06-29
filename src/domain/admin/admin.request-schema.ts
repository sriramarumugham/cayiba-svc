import {
  AuthHeaderDocument,
  ErrorResponses,
  SuccessResponseType,
} from "@/types/response.type";
import { FastifySchema } from "fastify";
import {
  AdminResponseDocument,
  createAdminDocument,
} from "../../types/admin.type";
import {
  PaginatedResponseSchema,
  PaginationQuerySchema,
} from "@/types/pagination.type";

export const createAdminRequestSchema = {
  tags: ["admin"],
  body: createAdminDocument,
  response: {
    ...ErrorResponses,
    201: SuccessResponseType(AdminResponseDocument),
  },
  security: [{ bearerAuth: [] }],
} satisfies FastifySchema;

export const createSubadminRequestSchema = {
  tags: ["admin"],
  body: createAdminDocument,
  response: {
    ...ErrorResponses,
    201: SuccessResponseType(AdminResponseDocument),
  },
  security: [{ bearerAuth: [] }],
} satisfies FastifySchema;

export const getSubadminListSchema = {
  tags: ["admin"],
  querystring: PaginationQuerySchema,
  response: {
    ...ErrorResponses,
    200: SuccessResponseType(PaginatedResponseSchema(AdminResponseDocument)),
  },
  security: [{ bearerAuth: [] }],
} satisfies FastifySchema;
