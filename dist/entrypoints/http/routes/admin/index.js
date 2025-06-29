"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_util_1 = require("../../../../utils/auth.util");
const admin_request_schema_1 = require("../../../../domain/admin/admin.request-schema");
const admin_usecase_1 = require("../../../../domain/admin/admin.usecase");
const dashboard_request_schema_1 = require("../../../../domain/dashboard/dashboard.request-schema");
const dashboard_usecase_1 = require("../../../../domain/dashboard/dashboard.usecase");
const response_1 = require("../../../../utils/response");
const paginate_1 = require("../../../../utils/paginate");
const AdminRoutes = async (fastify) => {
    fastify
        .withTypeProvider()
        .post("/signup", { schema: admin_request_schema_1.createAdminRequestSchema }, async (req, res) => {
        try {
            const admin = await (0, admin_usecase_1.createAdminUseCase)(req.body);
            (0, response_1.createSuccessResponse)(res, "Admin Created!", admin, 201);
        }
        catch (error) {
            const message = error.message || "An unexpected error occurred";
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .post("/sub-admin", { schema: admin_request_schema_1.createSubadminRequestSchema }, async (req, res) => {
        try {
            const { userId } = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const subadmin = await (0, admin_usecase_1.createSubadminUseCase)(req.body, userId, res);
            (0, response_1.createSuccessResponse)(res, "Subadmin Created!", subadmin, 201);
        }
        catch (error) {
            const message = error.message || "An unexpected error occurred";
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .get("/sub-admin", { schema: admin_request_schema_1.getSubadminListSchema }, async (req, res) => {
        try {
            const paginationOptions = (0, paginate_1.getPaginationOptions)(req);
            // console.log("paginationOptions", paginationOptions);
            const subadmins = await (0, admin_usecase_1.getSubadminListUseCase)(paginationOptions);
            (0, response_1.createSuccessResponse)(res, "Subadmin List!", subadmins, 200);
        }
        catch (error) {
            const message = error.message || "An unexpected error occurred";
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .get("/dashboard/stats", { schema: dashboard_request_schema_1.getDashboardStatsSchema }, async (req, res) => {
        try {
            const { userId } = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const stats = await (0, dashboard_usecase_1.getDashboardStatsUseCase)(userId);
            (0, response_1.createSuccessResponse)(res, "Dashboard Statistics!", stats, 200);
        }
        catch (error) {
            const message = error.message || "An unexpected error occurred";
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .get("/dashboard/graph", { schema: dashboard_request_schema_1.getDashboardGraphSchema }, async (req, res) => {
        try {
            const { userId } = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const { period } = req.query;
            const graphData = await (0, dashboard_usecase_1.getDashboardGraphUseCase)(userId, period);
            (0, response_1.createSuccessResponse)(res, "Dashboard Graph Data!", graphData, 200);
        }
        catch (error) {
            const message = error.message || "An unexpected error occurred";
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    });
};
exports.default = AdminRoutes;
