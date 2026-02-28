import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./CustomFetchBase";
import type { Category } from "@/schema-types/master-schema";

export const CategoryApi = createApi({
  reducerPath: "CategoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["CategoryTag"],
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => ({
        url: "category",
        method: "GET",
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
    getActiveCategories: build.query<Category[], void>({
      query: () => ({
        url: "category/active",
        method: "GET",
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
