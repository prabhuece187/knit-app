import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./CustomFetchBase";
import type { SubCategory, SubCategoryQueryType } from "@/schema-types/master-schema";
import type { BaseQuery } from "@/schema-types/pagination-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";

export const SubCategoryApi = createApi({
  reducerPath: "SubCategoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["SubCategoryTag"],
  endpoints: (build) => ({
    getSubCategories: build.query<PaginatedResponse<SubCategory>, SubCategoryQueryType>({
      query: (params) => ({
        url: "subcategory",
        method: "GET",
        params,
      }),
      providesTags: ["SubCategoryTag"],
    }),
    getSubCategoryById: build.query<SubCategory, number>({
      query: (id) => ({
        url: `subcategory/${id}`,
        method: "GET",
      }),
      providesTags: ["SubCategoryTag"],
    }),
    getSubCategoriesByCategory: build.query<PaginatedResponse<SubCategory>, SubCategoryQueryType>({
      query: (params) => ({
        url: "subcategory",
        method: "GET",
        params,
      }),
      providesTags: ["SubCategoryTag"],
    }),
    getActiveSubCategories: build.query<SubCategory[], BaseQuery>({
      query: () => ({
        url: "subcategory/active",
        method: "GET",
      }),
      providesTags: ["SubCategoryTag"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetActiveSubCategoriesQuery,
} = SubCategoryApi;
