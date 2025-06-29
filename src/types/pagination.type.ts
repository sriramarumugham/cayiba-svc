import { Static, TSchema, Type } from "@sinclair/typebox";

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 10 })),
  search: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal("asc"), Type.Literal("desc")], { default: "desc" })
  ),
});

export type PaginationQueryType = Static<typeof PaginationQuerySchema>;

export const PaginationInfoSchema = Type.Object({
  totalDocs: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number(),
  page: Type.Number(),
  pagingCounter: Type.Number(),
  hasPrevPage: Type.Boolean(),
  hasNextPage: Type.Boolean(),
  prevPage: Type.Union([Type.Number(), Type.Null()]),
  nextPage: Type.Union([Type.Number(), Type.Null()]),
});

export type PaginationInfoType = Static<typeof PaginationInfoSchema>;

export const PaginatedResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    docs: Type.Array(dataSchema),
    ...PaginationInfoSchema.properties,
  });

export type PaginatedResponseType<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};
