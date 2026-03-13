import { baseQuery } from "@/helper/ApiFetchBase";
import type { LinkJobCardResponse } from "@/pages/inward/component/JobCardSelectModal";
import type { Inward, InwardQuery } from "@/schema-types/inward-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";
export const InwardApi = createApi({
  reducerPath: "inwardApi",
  baseQuery: baseQuery,
  tagTypes: ["InwardTag"],
  endpoints: (build) => ({
    getInward: build.query<PaginatedResponse<Inward>, InwardQuery>({
      query: (params) => ({
        url: "inwards",
        method: "GET",
        params,
      }),
      providesTags: ["InwardTag"],
    }),
    getInwardById: build.query({
      query: (id) => ({
        url: `inward_edit/${id}`,
        method: "GET",
      }),
      providesTags: ["InwardTag"],
    }),
    postInward: build.mutation({
      query: (data) => ({
        url: "inward_add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["InwardTag"],
    }),
    putInward: build.mutation({
      query: (data) => ({
        url: `inward_update/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["InwardTag"],
    }),
    getInwardList: build.query({
      query: () => ({
        url: `inward_list`,
        method: "GET",
      }),
      providesTags: ["InwardTag"],
    }),
    postlinkJobCard: build.mutation<
      LinkJobCardResponse,
      { inwardDetailId: number; job_card_id: number }
    >({
      query: ({ inwardDetailId, job_card_id }) => ({
        url: `/inward-details/${inwardDetailId}/link-job-card`,
        method: "POST",
        body: { job_card_id },
      }),
    }),
  }),
});

export const {
  useGetInwardQuery,
  useGetInwardByIdQuery,
  usePostInwardMutation,
  usePutInwardMutation,
  useGetInwardListQuery,
  usePostlinkJobCardMutation,
} = InwardApi;
