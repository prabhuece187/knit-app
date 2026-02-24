import type { Mill, MillQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL as string;
export const MillApi = createApi({
  reducerPath: "MillApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["MillTag"],
  endpoints: (build) => ({
    getMill: build.query<PaginatedResponse<Mill>, MillQuery>({
      query: (params) => ({
        url: "mills",
        method: "GET",
        params, 
      }),
      providesTags: ["MillTag"],
    }),
    getMillById: build.query({
      query: (id) => ({
        url: `mills/${id}`,
        method: "GET",
      }),
      providesTags: ["MillTag"],
    }),
    postMill: build.mutation({
      query: (data) => ({
        url: "mills",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["MillTag"],
    }),
    putMill: build.mutation({
      query: (data) => ({
        url: `mills/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["MillTag"],
    }),
    getMillList: build.query({
      query: () => ({
        url: `mill_list`,
        method: "GET",
      }),
      providesTags: ["MillTag"],
    }),
    getSingleMillData: build.query({
      query: (data) => ({
        url: `single_mill_data/${data}`,
        method: "GET",
      }),
      providesTags: ["MillTag"],
    }),
  }),
});

export const {
  useGetMillQuery,
  useGetMillByIdQuery,
  usePostMillMutation,
  usePutMillMutation,
  useGetMillListQuery,
  useGetSingleMillDataQuery,
} = MillApi;
