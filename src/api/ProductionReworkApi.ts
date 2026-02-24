import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import type { KnittingRework, KnittingReworkQuery } from "@/schema-types/rework-schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL as string;

export const KnittingReworkApi = createApi({
  reducerPath: "KnittingReworkApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["KRTag"],
  endpoints: (build) => ({
    // LIST
    getReworks: build.query<
      PaginatedResponse<KnittingRework>,
      KnittingReworkQuery
    >({
      query: (params) => ({
        url: "knitting_rework",
        method: "GET",
        params,
      }),
      providesTags: ["KRTag"],
    }),

    // GET BY ID (EDIT)
    getReworkById: build.query<KnittingRework, number>({
      query: (id) => `knitting_rework_edit/${id}`,
      providesTags: ["KRTag"],
    }),

    // CREATE
    postRework: build.mutation<KnittingRework, Partial<KnittingRework>>({
      query: (body) => ({
        url: "knitting_rework_add",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KRTag"],
    }),

    // UPDATE
    putRework: build.mutation<KnittingRework, KnittingRework>({
      query: (body) => ({
        url: `knitting_rework_update/${body.id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KRTag"],
    }),

    // DELETE (if available)
    deleteRework: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `knitting_rework/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KRTag"],
    }),

    // NEXT REWORK NO
    getNextReworkNo: build.query<{ next_rework_no: string }, void>({
      query: () => "knitting_rework_create/next-no", // backend → reworkCreate()
      providesTags: ["KRTag"],
    }),

    // SELECT LIST (Dropdown / Popover)
    getReworkSelectList: build.query<
      {
        id: number;
        rework_no: string;
        rework_qty: number;
        production_return_id: number;
        job_card_id: number | null;
      }[],
      { q?: string }
    >({
      query: ({ q }) => `knitting_rework_select_list?q=${q ?? ""}`,
      providesTags: ["KRTag"],
    }),
  }),
});

export const {
  useGetReworksQuery,
  useGetReworkByIdQuery,
  usePostReworkMutation,
  usePutReworkMutation,
  useDeleteReworkMutation,
  useGetNextReworkNoQuery,
  useGetReworkSelectListQuery,
} = KnittingReworkApi;
