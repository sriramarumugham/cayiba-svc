import {
  getAdvertismentByIdRequestSchema,
  searchRequestSchema,
} from "@/domain/advertisment/advertisment.request-schema";
import {
  getAdvertismentByIdUsecase,
  incrementViewsUseCase,
  searchProductsUseCase,
} from "@/domain/advertisment/advertisment.usecase";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { Static, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"; // Import the search use case
import {
  E_STATUS,
  searchRequestDocument,
} from "../../../../types/advertisment.type";
import { isAdmin } from "@/data-access/admin.repo";
import { getUserIdFromRequestHeader } from "@/utils/auth.util";

const SearchRoute: FastifyPluginAsync = async (fastify) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .get(
      "/",
      { schema: searchRequestSchema },
      async (
        req: FastifyRequest<{
          Querystring: Static<typeof searchRequestDocument>;
        }>,
        res: FastifyReply
      ) => {
        try {
          const { productName, categoryName, searchText } = req.query;

          const products = await searchProductsUseCase({
            productName,
            categoryName,
            searchText,
          });

          createSuccessResponse(
            res,
            "Search results fetched successfully!",
            products
          );
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    )
    .get(
      "/:id",
      {
        schema: getAdvertismentByIdRequestSchema,
      },
      async (
        req: FastifyRequest<{
          Params: { id: string };
        }>,
        res: FastifyReply
      ) => {
        try {
          const { id } = req.params;

          const advertisment = await getAdvertismentByIdUsecase(id);

          // console.log("advertisment_", advertisment);

          if (!advertisment) {
            return createErrorResponse(
              res,
              "Advertisement not found or inactive",
              404
            );
          }

          let isAdminUser = false;

          try {
            const admin = getUserIdFromRequestHeader(req);
            const isTherUserAdmin = await isAdmin(admin?.userId);
            if (isTherUserAdmin) {
              isAdminUser = true;
            }
          } catch (error) {
            isAdminUser = false;
          }

          if (advertisment?.status != E_STATUS.ACTIVE) {
            if (!isAdminUser) {
              return createErrorResponse(
                res,
                "Advertisement not found or inactive",
                404
              );
            }
          }

          if (!isAdminUser) {
            await incrementViewsUseCase(id);
          }

          createSuccessResponse(
            res,
            "Advertisement fetched successfully!",
            advertisment
          );
        } catch (error: any) {
          const message = error.message || "An unexpected error occurred";
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      }
    );
};

export default SearchRoute;
