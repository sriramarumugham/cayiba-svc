"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const favourites_request_schema_1 = require("../../../../domain/favourites/favourites.request.schema");
const favourites_usecase_1 = require("../../../../domain/favourites/favourites.usecase");
const response_1 = require("../../../../utils/response");
const FavouriteRoutes = async (fastify) => {
    fastify.withTypeProvider()
        .post('/favourites', { schema: favourites_request_schema_1.addFavouriteSchema }, async (req, res) => {
        try {
            const { userId, advertismentId } = req.body;
            const favourite = await (0, favourites_usecase_1.addFavourite)(userId, advertismentId);
            (0, response_1.createSuccessResponse)(res, 'Added to favourites successfully!', favourite);
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    })
        .delete('/favourites', { schema: favourites_request_schema_1.removeFavouriteSchema }, async (req, res) => {
        try {
            const { userId, advertismentId } = req.body;
            await (0, favourites_usecase_1.removeFavourite)(userId, advertismentId);
            (0, response_1.createSuccessResponse)(res, 'Removed from favourites successfully!');
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    })
        .get('/favourites/:userId', { schema: favourites_request_schema_1.getUserFavouritesSchema }, async (req, res) => {
        try {
            const { userId } = req.params;
            const favourites = await (0, favourites_usecase_1.getUserFavourites)(userId);
            (0, response_1.createSuccessResponse)(res, 'User favourites fetched successfully!', favourites);
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    });
};
exports.default = FavouriteRoutes;
