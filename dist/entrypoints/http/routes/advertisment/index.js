"use strict";
//  create advertisment
//   before creatina an advertisment user hast to complet his profile
Object.defineProperty(exports, "__esModule", { value: true });
const advertisment_request_schema_1 = require("../../../../domain/advertisment/advertisment.request-schema");
const advertisment_usecase_1 = require("../../../../domain/advertisment/advertisment.usecase");
const advertisment_util_1 = require("../../../../utils/advertisment.util");
const auth_util_1 = require("../../../../utils/auth.util");
const response_1 = require("../../../../utils/response");
const s3_util_1 = require("../../../../utils/s3.util");
const AdvertismentRoutes = async (fastify) => {
    fastify
        .withTypeProvider()
        .post('', {
        schema: advertisment_request_schema_1.createAdvertismentRequestSchema
    }, async (req, res) => {
        try {
            const MAX_FILE_SIZE = 2 * 1024 * 1024;
            const body = req.body;
            let preparedFiles = [];
            try {
                const files = Array.isArray(body?.file) ? body.file : [body?.file];
                if (files.length > 4) {
                    throw new Error("Cannot upload more than 4 imags");
                }
                preparedFiles = (await Promise.all(files?.map(async (fileData) => {
                    const fileBuffer = await fileData?.toBuffer();
                    if (!fileBuffer) {
                        return;
                    }
                    if (fileBuffer?.length > MAX_FILE_SIZE) {
                        throw new Error(`File ${fileData.filename} exceeds the 2MB size limit.`);
                    }
                    const filePayload = {
                        fileName: fileData?.filename,
                        mimetype: fileData?.mimetype,
                        file: fileBuffer
                    };
                    return filePayload;
                }) || []));
            }
            catch (error) {
                console.log('FileProcessingError', error);
            }
            let uploadedFilesUrls = [""];
            try {
                if (preparedFiles.length > 0) {
                    uploadedFilesUrls = await (0, s3_util_1.s3BulkUpload)(preparedFiles);
                }
            }
            catch (error) {
                console.log("ERRO_UPLPADIN_FILES__", error);
            }
            try {
                console.log("uploadedFilesUrls__", uploadedFilesUrls);
                const user = (0, auth_util_1.getUserIdFromRequestHeader)(req);
                console.log("USER__", user);
                const payload = (0, advertisment_util_1.prepareAdvertisment)(body);
                console.log("PAYLOAD__", payload);
                payload.images = uploadedFilesUrls;
                await (0, advertisment_usecase_1.createAdvertismentUseCase)(payload, user.userId);
                return (0, response_1.createSuccessResponse)(res, 'Advertisement created!');
            }
            catch (error) {
                const message = error?.message || 'An unexpected error occurred';
                const statusCode = error?.status || 500;
                return (0, response_1.createErrorResponse)(res, message, statusCode);
            }
        }
        catch (error) {
            const message = error.message || 'An unexpected error occurred';
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .patch('/inventoryDetails/:id', { schema: advertisment_request_schema_1.updateAdvertismentInverntorySchema }, async (req, res) => {
        try {
            const user = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            await (0, advertisment_usecase_1.updateAdvertismentStatusUseCase)(req.params.id, req.body, user.userId);
            (0, response_1.createSuccessResponse)(res, 'Advertisement status updated!');
        }
        catch (error) {
            const message = error.message || 'An unexpected error occurred';
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .delete('/:id', { schema: advertisment_request_schema_1.deleteAdvertismentSchema }, async (req, res) => {
        try {
            const user = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            await (0, advertisment_usecase_1.deleteAdvertismentUseCase)(req.params.id, user.userId);
            (0, response_1.createSuccessResponse)(res, 'Advertisement deleted successfully!');
        }
        catch (error) {
            const message = error.message || 'An unexpected error occurred';
            const statusCode = error.status || 500;
            (0, response_1.createErrorResponse)(res, message, statusCode);
        }
    })
        .get('/my-advertisements', { schema: advertisment_request_schema_1.getPublishedAdvertisementsSchema }, async (req, res) => {
        try {
            const user = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const advertisments = await (0, advertisment_usecase_1.getUserAdvertismentsUsecase)(user.userId);
            (0, response_1.createSuccessResponse)(res, 'Advertisements fetched successfully!', advertisments);
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    })
        .get('/admin/advertisments', { schema: advertisment_request_schema_1.getAdvertismentByStatusSchema }, // Add schema here
    async (req, res) => {
        try {
            const admin = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const { status } = req.query; // Extract status from query
            const advertisments = await (0, advertisment_usecase_1.getAdvertismentByStatus)(admin.userId, status);
            (0, response_1.createSuccessResponse)(res, 'Advertisements fetched successfully!', advertisments);
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    })
        .post('/admin/block/:advertismentId', { schema: advertisment_request_schema_1.blockAdvertismentSchema }, // Add schema here
    async (req, res) => {
        try {
            const admin = (0, auth_util_1.getUserIdFromRequestHeader)(req);
            const { advertismentId } = req.params; // Extract advertisement ID from params
            await (0, advertisment_usecase_1.blockAdvertismentUseCase)(admin.userId, advertismentId); // Call the blocking use case
            (0, response_1.createSuccessResponse)(res, 'Advertisement blocked successfully!');
        }
        catch (error) {
            (0, response_1.createErrorResponse)(res, error.message || 'An unexpected error occurred', error.status || 500);
        }
    });
};
exports.default = AdvertismentRoutes;
