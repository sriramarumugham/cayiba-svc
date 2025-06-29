import { isAdmin } from "@/data-access/admin.repo";
import AdvertismentModel from "@/data-access/models/advertisment.schema";
import UserModel from "@/data-access/models/user.schema";
import {
  AdvertisementWithUserAlt,
  AdvertismentDocument,
  CreateAdvertismentRequestType,
  E_INVENTORY_STATUS,
  E_STATUS,
  UpdateInventoryType,
} from "@/types";
import {
  PaginatedResponseType,
  PaginationQueryType,
} from "@/types/pagination.type";
import {
  buildSearchPipeline,
  buildSortPipeline,
  createPaginationOptions,
} from "@/utils/paginate";
import { PipelineStage } from "mongoose";

export const createAdvertismentUseCase = async (
  body: CreateAdvertismentRequestType,
  userId: string
) => {
  const user = await UserModel.findOne({ userId });
  if (!user) {
    throw new Error("User not found");
  }

  // TODO profile to upload user information
  // if (!isValidProfile.Check(user)) {
  //   throw new Error('User profile is incomplete. Please update your profile.');
  // }

  const response = await AdvertismentModel.create({
    ...body,
    status: E_STATUS.ACTIVE,
    createdAt: new Date(),
    createdBy: userId,
  });
  return response;
};

export const deleteAdvertismentUseCase = async (
  advertismentId: string,
  userId: string
) => {
  const advertisment = await AdvertismentModel.findOne({
    advertismentId: advertismentId,
    createdBy: userId,
  });

  if (!advertisment) {
    throw new Error("Advertisement not found or access denied.");
  }

  await AdvertismentModel.updateOne({ status: E_STATUS.DELETED });
};

export const updateAdvertismentStatusUseCase = async (
  advertismentId: string,
  body: UpdateInventoryType,
  userId: string
) => {
  const advertisment = await AdvertismentModel.findOne({
    advertismentId: advertismentId,
    createdBy: userId,
  });

  if (!advertisment) {
    throw new Error("Advertisement not found or access denied.");
  }

  await AdvertismentModel.updateOne({
    inventoryDetails: body?.inventoryDetails,
  });
};

const INVENTORY_ORDER: Record<E_INVENTORY_STATUS, number> = {
  [E_INVENTORY_STATUS.AVAILABLE]: 1,
  [E_INVENTORY_STATUS.SOLD]: 2,
  [E_INVENTORY_STATUS.UNLIST]: 3,
};

export const getUserAdvertismentsUsecase = async (
  userId: string
): Promise<AdvertismentDocument[]> => {
  const adverts = await AdvertismentModel.find<AdvertismentDocument>({
    status: E_STATUS.ACTIVE,
    createdBy: userId,
  }).exec();

  return adverts.sort((a, b) => {
    return (
      INVENTORY_ORDER[a.inventoryDetails] - INVENTORY_ORDER[b.inventoryDetails]
    );
  });
};

export const blockAdvertismentUseCase = async (
  adminId: string,
  advertismentId: string
): Promise<void> => {
  const isAdminUser = await isAdmin(adminId);

  if (!isAdminUser) {
    throw new Error("Only admins can update advertisement statuses");
  }

  await AdvertismentModel.findOneAndUpdate(
    { advertismentId },
    { status: E_STATUS.BLOCKED },
    { new: true }
  );
};

export const getAdvertismentByStatus = async (
  adminId: string,
  status: E_STATUS,
  options: PaginationQueryType
): Promise<PaginatedResponseType<AdvertismentDocument>> => {
  const isAdminUser = await isAdmin(adminId);

  if (!isAdminUser) {
    throw new Error("Only admins can  acces the  advertisement buystatuses");
  }

  const { search, sortBy = "createdAt", sortOrder = "desc" } = options;

  const pipeline: PipelineStage[] = [
    // Base filter for status
    // { $match: { status: status } },

    // Add search functionality if needed (optional)
    ...(search || status
      ? buildSearchPipeline(
          [
            "productDescription",
            "productName",
            "categoryName",
            "subcategoryName",
          ], // Add relevant searchable fields
          search,
          { status: status }
        )
      : []),

    // Add sorting
    ...buildSortPipeline(sortBy, sortOrder),
  ];

  const paginationOptions = createPaginationOptions(options);

  // console.log("PAGINATION_OPTOINS", JSON.stringify(pipeline, null, 2));
  const result = await AdvertismentModel.aggregatePaginate(
    AdvertismentModel.aggregate(pipeline),
    paginationOptions
  );

  return {
    docs: result.docs,
    totalDocs: result.totalDocs,
    limit: result.limit,
    totalPages: result.totalPages,
    page: result.page,
    pagingCounter: result.pagingCounter,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
  } as PaginatedResponseType<AdvertismentDocument>;
};

export const searchProductsUseCase = async ({
  productName,
  categoryName,
  searchText,
}: {
  productName?: string;
  categoryName?: string;
  searchText?: string;
}): Promise<any> => {
  const query: any = {
    status: E_STATUS.ACTIVE,
    inventoryDetails: E_INVENTORY_STATUS.AVAILABLE,
  };

  if (productName) {
    query.productName = { $regex: productName, $options: "i" }; // Case-insensitive search
  }

  if (categoryName) {
    query.categoryName = { $regex: categoryName, $options: "i" };
  }

  if (searchText) {
    const regex = new RegExp(searchText, "i");
    query.$or = [
      { productName: { $regex: regex } },
      { categoryName: { $regex: regex } },
      { productDescription: { $regex: regex } },
    ];
  }

  const results = await AdvertismentModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "users",
        foreignField: "userId",
        localField: "createdBy",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        "userDetails.password": 0,
        "userDetails.userId": 0,
      },
    },
  ]);

  return results;
};

export const getAdvertismentByIdUsecase = async (
  id: string
): Promise<AdvertisementWithUserAlt | null> => {
  const ad = await AdvertismentModel.aggregate([
    {
      $match: {
        advertismentId: id,
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "userId",
        as: "uploadedBy",
        pipeline: [
          {
            $project: {
              fullName: 1,
              phoneNumber: 1,
              countryCode: 1,
              email: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$uploadedBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  if (!ad.length) {
    throw new Error("Product not found!");
  }
  return ad[0];
};

export const incrementViewsUseCase = (advertismentId: string) =>
  AdvertismentModel.findOneAndUpdate(
    { advertismentId },
    { $inc: { views: 1 } }
  );
