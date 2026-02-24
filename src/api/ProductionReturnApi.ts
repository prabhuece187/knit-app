import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductionReturn, ProductionReturnQuery } from "@/schema-types/production-return-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";

const baseUrl = import.meta.env.VITE_API_URL as string;

export const ProductionReturnApi = createApi({
  reducerPath: "ProductionReturnApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["KPRTag"],
  endpoints: (build) => ({
    getReturns: build.query<
      PaginatedResponse<ProductionReturn>,
      ProductionReturnQuery
    >({
      query: (params) => ({
        url: "knitting_production_return",
        method: "GET",
        params,
      }),
      providesTags: ["KPRTag"],
    }),

    getReturnById: build.query<ProductionReturn, number>({
      query: (id) => `knitting_production_return_edit/${id}`,
      providesTags: ["KPRTag"],
    }),

    postReturn: build.mutation<ProductionReturn, Partial<ProductionReturn>>({
      query: (body) => ({
        url: "knitting_production_return_add",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KPRTag"],
    }),

    putReturn: build.mutation<ProductionReturn, ProductionReturn>({
      query: (body) => ({
        url: `knitting_production_return_update/${body.id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KPRTag"],
    }),

    deleteReturn: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `production-return/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KPRTag"],
    }),

    getNextReturnNo: build.query<{ next_return_no: string }, void>({
      query: () => "production-return/next-no", // your backend route pointing to returnCreate()
      providesTags: ["KPRTag"],
    }),

    getProductionReturnList: build.query({
      query: () => ({
        url: `knitting_production_return_list`,
        method: "GET",
      }),
      providesTags: ["KPRTag"],
    }),
  }),
});

export const {
  useGetReturnsQuery,
  useGetReturnByIdQuery,
  usePostReturnMutation,
  usePutReturnMutation,
  useDeleteReturnMutation,
  useGetNextReturnNoQuery,
  useGetProductionReturnListQuery,
} = ProductionReturnApi;
