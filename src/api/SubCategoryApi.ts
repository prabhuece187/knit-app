import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import type { SubCategory } from "@/schema-types/master-schema";

export const SubCategoryApi = createApi({
  reducerPath: "SubCategoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["SubCategoryTag"],
  endpoints: (build) => ({
    getSubCategories: build.query<SubCategory[], void>({
      query: () => ({
        url: "subcategory",
        method: "GET",
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
    getSubCategoriesByCategory: build.query<SubCategory[], number>({
      query: (categoryId) => ({
        url: `subcategory/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["SubCategoryTag"],
    }),
    getActiveSubCategories: build.query<SubCategory[], void>({
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
