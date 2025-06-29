import { AdminResponseType } from "@/types";
import { getUserIdFromRequestHeader } from "@/utils/auth.util";
import { Static, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import {
  createAdminRequestSchema,
  createSubadminRequestSchema,
  getSubadminListSchema,
} from "../../../../domain/admin/admin.request-schema";
import {
  createAdminUseCase,
  createSubadminUseCase,
  getSubadminListUseCase,
} from "../../../../domain/admin/admin.usecase";
import {
  getDashboardStatsSchema,
  getDashboardGraphSchema,
} from "../../../../domain/dashboard/dashboard.request-schema";
import {
  getDashboardStatsUseCase,
  getDashboardGraphUseCase,
} from "../../../../domain/dashboard/dashboard.usecase";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../../utils/response";
import { getPaginationOptions } from "@/utils/paginate";

const AdminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .post(
      "/signup",
      { schema: createAdminRequestSchema },
      async (
        req: FastifyRequest<{
          Body: Static<typeof createAdminRequestSchema.body>;
        }>,
        res: FastifyReply
      ) => {
        try {
          const admin: AdminResponseType = await createAdminUseCase(req.body);
          createSuccessResponse(res, "Admin Created!", admin, 201);
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    )
    .post(
      "/sub-admin",
      { schema: createSubadminRequestSchema },
      async (
        req: FastifyRequest<{
          Body: Static<typeof createSubadminRequestSchema.body>;
        }>,
        res: FastifyReply
      ) => {
        try {
          const { userId } = getUserIdFromRequestHeader(req);
          const subadmin = await createSubadminUseCase(req.body, userId, res);
          createSuccessResponse(res, "Subadmin Created!", subadmin, 201);
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    )
    .get("/sub-admin", { schema: getSubadminListSchema }, async (req, res) => {
      try {
        const paginationOptions = getPaginationOptions(req);
        console.log("paginationOptions", paginationOptions);

        const subadmins = await getSubadminListUseCase(paginationOptions);
        createSuccessResponse(res, "Subadmin List!", subadmins, 200);
      } catch (error: any) {
        const message = error.message || "An unexpected error occurred";
        const statusCode = error.status || 500;
        createErrorResponse(res, message, statusCode);
      }
    })
    .get(
      "/dashboard/stats",
      { schema: getDashboardStatsSchema },
      async (req, res) => {
        try {
          const { userId } = getUserIdFromRequestHeader(req);
          const stats = await getDashboardStatsUseCase(userId);
          createSuccessResponse(res, "Dashboard Statistics!", stats, 200);
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    )
    .get(
      "/dashboard/graph",
      { schema: getDashboardGraphSchema },
      async (req, res) => {
        try {
          const { userId } = getUserIdFromRequestHeader(req);
          const { period } = req.query as { period?: string };
          const graphData = await getDashboardGraphUseCase(userId, period);
          createSuccessResponse(res, "Dashboard Graph Data!", graphData, 200);
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    );
};

export default AdminRoutes;
