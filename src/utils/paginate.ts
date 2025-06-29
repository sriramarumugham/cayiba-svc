// ========================================
// Reusable Pagination Utility Functions
// ========================================

// utils/pagination.util.ts
import { PaginationQueryType } from "@/types/pagination.type";
import { FastifyRequest } from "fastify";
import { PipelineStage } from "mongoose";

export const buildSearchPipeline = (
  searchFields: string[],
  searchTerm?: string,
  defaultMatch?: Record<string, any>
): PipelineStage[] => {
  if (!searchTerm?.trim()) {
    return defaultMatch ? [{ $match: defaultMatch }] : [];
  }

  const searchMatch = {
    $or: searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  // wrap both in $and if defaultMatch exists
  const combinedMatch = defaultMatch
    ? { $and: [defaultMatch, searchMatch] }
    : searchMatch;

  return [{ $match: combinedMatch }];
};
export const buildSortPipeline = (
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): PipelineStage[] => {
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  if (!sortBy) {
    sortBy = "createdAt";
  }
  return [
    {
      $sort: {
        [sortBy]: sortDirection,
      },
    },
  ];
};

export const getPaginationOptions = (
  req: FastifyRequest
): Required<PaginationQueryType> => {
  const query = req.query as PaginationQueryType;

  return {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    search: query.search! ?? undefined,
    sortBy: query.sortBy ?? "createdAt",
    sortOrder: query.sortOrder ?? "desc",
  };
};

export const createPaginationOptions = (options: PaginationQueryType) => {
  return {
    page: Math.max(1, options.page || 1),
    limit: Math.min(100, Math.max(1, options.limit || 10)),
    customLabels: {
      totalDocs: "totalDocs",
      docs: "docs",
      limit: "limit",
      page: "page",
      nextPage: "nextPage",
      prevPage: "prevPage",
      totalPages: "totalPages",
      pagingCounter: "pagingCounter",
      hasPrevPage: "hasPrevPage",
      hasNextPage: "hasNextPage",
    },
  };
};
