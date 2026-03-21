import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./CustomFetchBase";
import type { Category, CategoryQueryType } from "@/schema-types/master-schema";
import type { BaseQuery } from "@/schema-types/pagination-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";

export const CategoryApi = createApi({
  reducerPath: "CategoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["CategoryTag"],
  endpoints: (build) => ({
    getCategories: build.query<PaginatedResponse<Category>, CategoryQueryType>({
      query: (params) => ({
        url: "category",
        method: "GET",
        params,
      }),
      providesTags: ["CategoryTag"],
    }),
    getCategoryById: build.query<Category, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: "GET",
      }),
      providesTags: ["CategoryTag"],
    }),
    getActiveCategories: build.query<Category[], BaseQuery>({
      query: (params) => ({
        url: "category/active",
        method: "GET",
        params,
      }),
      providesTags: ["CategoryTag"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetActiveCategoriesQuery,
} = CategoryApi;
