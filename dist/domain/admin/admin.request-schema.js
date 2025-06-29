"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubadminListSchema = exports.createSubadminRequestSchema = exports.createAdminRequestSchema = void 0;
const response_type_1 = require("../../types/response.type");
const admin_type_1 = require("../../types/admin.type");
const pagination_type_1 = require("../../types/pagination.type");
exports.createAdminRequestSchema = {
    tags: ["admin"],
    body: admin_type_1.createAdminDocument,
    response: {
        ...response_type_1.ErrorResponses,
        201: (0, response_type_1.SuccessResponseType)(admin_type_1.AdminResponseDocument),
    },
    security: [{ bearerAuth: [] }],
};
exports.createSubadminRequestSchema = {
    tags: ["admin"],
    body: admin_type_1.createAdminDocument,
    response: {
        ...response_type_1.ErrorResponses,
        201: (0, response_type_1.SuccessResponseType)(admin_type_1.AdminResponseDocument),
    },
    security: [{ bearerAuth: [] }],
};
exports.getSubadminListSchema = {
    tags: ["admin"],
    querystring: pagination_type_1.PaginationQuerySchema,
    response: {
        ...response_type_1.ErrorResponses,
        200: (0, response_type_1.SuccessResponseType)((0, pagination_type_1.PaginatedResponseSchema)(admin_type_1.AdminResponseDocument)),
    },
    security: [{ bearerAuth: [] }],
};
