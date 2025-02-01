//  create advertisment
//   before creatina an advertisment user hast to complet his profile

import {
  blockAdvertismentSchema,
  createAdvertismentRequestSchema,
  deleteAdvertismentSchema,
  getAdvertismentByStatusSchema,
  getPublishedAdvertisementsSchema,
  updateAdvertismentInverntorySchema,
} from '@/domain/advertisment/advertisment.request-schema';
import {
  blockAdvertismentUseCase,
  createAdvertismentUseCase,
  deleteAdvertismentUseCase,
  getAdvertismentByStatus,
  getUserAdvertismentsUsecase,
  updateAdvertismentStatusUseCase,
} from '@/domain/advertisment/advertisment.usecase';
import { AdvertismentTypeRequestType } from '@/types';
import { prepareAdvertisment, validateAdvertismentForm } from '@/utils/advertisment.util';
import { getUserIdFromRequestHeader } from '@/utils/auth.util';
import { createErrorResponse, createSuccessResponse } from '@/utils/response';
import { CustomFile, s3BulkUpload } from '@/utils/s3.util';
import { Static, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

const AdvertismentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .post(
      '', {
      schema: createAdvertismentRequestSchema
    },
      async (
        req: FastifyRequest<{
          Body: any;
        }>,
        res: FastifyReply,
      ) => {
        try {
          const MAX_FILE_SIZE = 2 * 1024 * 1024;

          const body = req.body as unknown as any;


          const files = Array.isArray(body?.file) ? body.file : [body?.file];

          if (files.length > 4) {
            throw new Error("Cannot upload more than 4 imags");
          }

          const preparedFiles: CustomFile[] = (await Promise.all(
            files?.map(async (fileData: any) => {
              const fileBuffer = await fileData.toBuffer();
              
              if (fileBuffer.length > MAX_FILE_SIZE) {
                throw new Error(`File ${fileData.filename} exceeds the 2MB size limit.`);
              }

              const filePayload = {
                fileName: fileData.filename,
                mimetype: fileData.mimetype,
                file: fileBuffer
              };
              return filePayload;
            }) || [],
          )) as CustomFile[];
          
          const uploadedFilesUrls = await s3BulkUpload(preparedFiles);



          try {
            const user = getUserIdFromRequestHeader(req);
            const payload:any = prepareAdvertisment(body as unknown as any);  
            payload.images = uploadedFilesUrls; 
            await createAdvertismentUseCase(payload, user.userId); 
           return createSuccessResponse(res, 'Advertisement created!');
          } catch (error:any) {
            const message = error?.message || 'An unexpected error occurred';
            const statusCode = error?.status || 500;
           return createErrorResponse(res, message, statusCode);
          }
        } catch (error: any) {
          const message = error.message || 'An unexpected error occurred';
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      },
    )
    .patch(
      '/inventoryDetails/:id',
      { schema: updateAdvertismentInverntorySchema },
      async (
        req: FastifyRequest<{
          Params: { id: string };
          Body: Static<typeof updateAdvertismentInverntorySchema.body>;
        }>,
        res: FastifyReply,
      ) => {
        try {
          const user = getUserIdFromRequestHeader(req);
          await updateAdvertismentStatusUseCase(
            req.params.id,
            req.body,
            user.userId,
          );
          createSuccessResponse(res, 'Advertisement status updated!');
        } catch (error: any) {
          const message = error.message || 'An unexpected error occurred';
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      },
    )
    .delete(
      '/:id',
      { schema: deleteAdvertismentSchema },
      async (
        req: FastifyRequest<{ Params: { id: string } }>,
        res: FastifyReply,
      ) => {
        try {
          const user = getUserIdFromRequestHeader(req);
          await deleteAdvertismentUseCase(req.params.id, user.userId);
          createSuccessResponse(res, 'Advertisement deleted successfully!');
        } catch (error: any) {
          const message = error.message || 'An unexpected error occurred';
          const statusCode = error.status || 500;
          createErrorResponse(res, message, statusCode);
        }
      },
    )
    .get(
      '/my-advertisements',
      { schema: getPublishedAdvertisementsSchema },
      async (req: FastifyRequest, res: FastifyReply) => {
        try {
          const user = getUserIdFromRequestHeader(req);
          const advertisments = await getUserAdvertismentsUsecase(user.userId);
          createSuccessResponse(
            res,
            'Advertisements fetched successfully!',
            advertisments,
          );
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500,
          );
        }
      },
    )
    .get(
      '/admin/advertisments',
      { schema: getAdvertismentByStatusSchema }, // Add schema here
      async (
        req: FastifyRequest<{
          Querystring: Static<typeof getAdvertismentByStatusSchema.querystring>;
        }>,
        res: FastifyReply,
      ) => {
        try {
          const admin = getUserIdFromRequestHeader(req);
          const { status } = req.query; // Extract status from query
          const advertisments = await getAdvertismentByStatus(
            admin.userId,
            status,
          );
          createSuccessResponse(
            res,
            'Advertisements fetched successfully!',
            advertisments,
          );
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500,
          );
        }
      },
    )
    .post(
      '/admin/block/:advertismentId',
      { schema: blockAdvertismentSchema }, // Add schema here
      async (
        req: FastifyRequest<{
          Params: Static<typeof blockAdvertismentSchema.params>;
        }>,
        res: FastifyReply,
      ) => {
        try {
          const admin = getUserIdFromRequestHeader(req);
          const { advertismentId } = req.params; // Extract advertisement ID from params
          await blockAdvertismentUseCase(admin.userId, advertismentId); // Call the blocking use case
          createSuccessResponse(res, 'Advertisement blocked successfully!');
        } catch (error: any) {
          createErrorResponse(
            res,
            error.message || 'An unexpected error occurred',
            error.status || 500,
          );
        }
      },
    );
};

export default AdvertismentRoutes;
