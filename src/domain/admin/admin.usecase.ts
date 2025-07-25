import { AdminType, E_ROLE } from "@/types";
import { generateReferralCode } from "@/utils/random.util";
import { createErrorResponse } from "@/utils/response";
import { getRandomValues } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  createAdminRepo,
  getAdminByAdminId,
  getSubadminListRepo,
} from "../../data-access/admin.repo";
import { hashPassword } from "@/utils/bycrypt.util";
import {
  PaginatedResponseType,
  PaginationQueryType,
} from "@/types/pagination.type";

export const createAdminUseCase = async (
  adminData: Partial<AdminType>
): Promise<AdminType> => {
  const hashedPassword = await hashPassword(adminData.password!);

  const payload: Partial<AdminType> = {
    ...adminData,
    role: E_ROLE.ADMIN,
    createdBy: null,
    referralCode: "WELCOMECAYIBA",
    password: hashedPassword,
  };

  return await createAdminRepo(payload);
};

export const createSubadminUseCase = async (
  subAdminData: Partial<AdminType>,
  createdBy: string,
  reply: FastifyReply
) => {
  const admin = await getAdminByAdminId(createdBy);
  if (!admin) {
    return createErrorResponse(
      reply,
      "User has to be a admin to create a subadmin",
      401
    );
  }
  if (admin.role != E_ROLE.ADMIN) {
    return createErrorResponse(reply, "Only admin can create a subadmin", 401);
  }

  const hashedPassword = await hashPassword(subAdminData.password!);

  const subAdminPayload: Partial<AdminType> = {
    ...subAdminData,
    role: E_ROLE.SUB_ADMIN,
    createdBy: createdBy,
    referralCode: generateReferralCode(subAdminData.fullName!),
    password: hashedPassword,
  };
  return await createAdminRepo(subAdminPayload);
};

export const getSubadminListUseCase = async (
  options: PaginationQueryType
): Promise<PaginatedResponseType<Omit<AdminType, "password">>> => {
  return await getSubadminListRepo(options);
};
