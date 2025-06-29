"use strict";
// ========================================
// Reusable Pagination Utility Functions
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationOptions = exports.getPaginationOptions = exports.buildSortPipeline = exports.buildSearchPipeline = void 0;
const buildSearchPipeline = (searchFields, searchTerm, defaultMatch) => {
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
exports.buildSearchPipeline = buildSearchPipeline;
const buildSortPipeline = (sortBy = "createdAt", sortOrder = "desc") => {
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
exports.buildSortPipeline = buildSortPipeline;
const getPaginationOptions = (req) => {
    const query = req.query;
    return {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        search: query.search ?? undefined,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
    };
};
exports.getPaginationOptions = getPaginationOptions;
const createPaginationOptions = (options) => {
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
exports.createPaginationOptions = createPaginationOptions;
