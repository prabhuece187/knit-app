// src/api/KnittingProductionApi.ts
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import type { KnittingProduction, KnittingProductionQuery } from "@/schema-types/production-schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL as string;

export const KnittingProductionApi = createApi({
  reducerPath: "knittingProductionApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["KnittingProductionTag"],
  endpoints: (build) => ({
    getKnittingProduction: build.query<
      PaginatedResponse<KnittingProduction>,
      KnittingProductionQuery
    >({
      query: (params) => ({
        url: "knitting_production",
        method: "GET",
        params,
      }),
      providesTags: ["KnittingProductionTag"],
    }),

    getNextProNo: build.query<{ pro_no: string }, void>({
      query: () => "/knit_next_pro_no",
    }),

    getKnittingProductionById: build.query({
      query: (id: number) => ({
        url: `knitting_production_edit/${id}`,
        method: "GET",
      }),
      providesTags: ["KnittingProductionTag"],
    }),

    postKnittingProduction: build.mutation({
      query: (data) => ({
        url: `knitting_production_add`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["KnittingProductionTag"],
    }),

    putKnittingProduction: build.mutation({
      query: (data) => ({
        url: `knitting_production_update/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["KnittingProductionTag"],
    }),

    getKnittingProductionList: build.query({
      query: () => ({
        url: `knitting_production_list`,
        method: "GET",
      }),
      providesTags: ["KnittingProductionTag"],
    }),
  }),
});

export const {
  useGetKnittingProductionQuery,
  useGetKnittingProductionByIdQuery,
  useGetNextProNoQuery,
  usePostKnittingProductionMutation,
  usePutKnittingProductionMutation,
  useGetKnittingProductionListQuery,
} = KnittingProductionApi;
