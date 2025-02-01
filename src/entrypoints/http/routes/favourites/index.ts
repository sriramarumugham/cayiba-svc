import { addFavouriteSchema, getUserFavouritesSchema, removeFavouriteSchema } from "@/domain/favourites/favourites.request.schema";
import { addFavourite, getUserFavourites, removeFavourite } from "@/domain/favourites/favourites.usecase";
import { FavouriteRequestType } from "@/types/favourite.type";
import { createSuccessResponse, createErrorResponse } from "@/utils/response";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const FavouriteRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>()

    .post(
      '/favourites',
      { schema: addFavouriteSchema },
      async (req: FastifyRequest<{ Body: FavouriteRequestType }>, res: FastifyReply) => {
        try {
          const { userId, advertismentId } = req.body;
          const favourite = await addFavourite(userId, advertismentId);
          createSuccessResponse(res, 'Added to favourites successfully!', favourite);
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500
          );
        }
      }
    )

    .delete(
      '/favourites',
      { schema: removeFavouriteSchema },
      async (req: FastifyRequest<{ Body: FavouriteRequestType }>, res: FastifyReply) => {
        try {
          const { userId, advertismentId } = req.body;
          await removeFavourite(userId, advertismentId);
          createSuccessResponse(res, 'Removed from favourites successfully!');
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500
          );
        }
      }
    )

    .get(
      '/favourites/:userId',
      { schema: getUserFavouritesSchema },
      async (req: FastifyRequest<{ Params: { userId: string } }>, res: FastifyReply) => {
        try {
          const { userId } = req.params;
          const favourites = await getUserFavourites(userId);
          createSuccessResponse(res, 'User favourites fetched successfully!', favourites);
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500
          );
        }
      }
    );
};

export default FavouriteRoutes;
