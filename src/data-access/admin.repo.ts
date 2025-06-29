import {
  PaginatedResponseType,
  PaginationQueryType,
} from "@/types/pagination.type";
import { AdminType, E_ROLE } from "../types/admin.type";
import AdminModel from "./models/admin.schema";
import { PipelineStage } from "mongoose";
import {
  buildSearchPipeline,
  buildSortPipeline,
  createPaginationOptions,
} from "@/utils/paginate";

export const createAdminRepo = async (
  adminData: Partial<AdminType>
): Promise<AdminType> => {
  return await AdminModel.create(adminData);
};

export const getAdminByEmailRepo = async (
  email: string
): Promise<AdminType | null> => {
  const admin = await AdminModel.findOne({ email });
  return admin ? admin.toObject() : null;
};

export const getAdminByAdminId = async (
  adminId: string
): Promise<AdminType | null> => {
  return await AdminModel.findOne({ adminId: adminId });
};

export const isAdmin = async (adminId: string): Promise<boolean> => {
  const admin = await AdminModel.findOne({ adminId });
  return admin?.role === E_ROLE.ADMIN;
};

export const getSubadminListRepo = async (
  options: PaginationQueryType
): Promise<PaginatedResponseType<Omit<AdminType, "password">>> => {
  const { search, sortBy = "createdAt", sortOrder = "desc" } = options;

  const pipeline: PipelineStage[] = [
    // Add any base filters
    { $match: { role: E_ROLE.SUB_ADMIN } },

    ...buildSearchPipeline(
      ["fullName", "email", "referralCode", "phoneNumber"],
      search
    ),
    {
      $project: {
        adminId: 1,
        fullName: 1,
        email: 1,
        phoneNumber: 1,
        countryCode: 1,
        country: 1,
        role: 1,
        createdBy: 1,
        referralCode: 1,
        _id: 0,
      },
    },
    // Add sorting
    ...buildSortPipeline(sortBy, sortOrder),
  ];
  const paginationOptions = createPaginationOptions(options);

  const result = await AdminModel.aggregatePaginate(
    AdminModel.aggregate(pipeline),
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
  } as PaginatedResponseType<Omit<AdminType, "password">>;
};
