import { baseQuery } from "@/helper/ApiFetchBase";
import type { YarnType, YarnTypeQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi  } from "@reduxjs/toolkit/query/react";

export const YarnTypeApi = createApi({
  reducerPath: "YarnTypeApi",
  baseQuery: baseQuery,
  tagTypes: ["YarnTypeTag"],
  endpoints: (build) => ({
    getYarnType: build.query<PaginatedResponse<YarnType>, YarnTypeQuery>({
      query: (params) => ({
        url: "yarn_types",
        method: "GET",
        params, // ✅ RTK Query builds query string
      }),
      providesTags: ["YarnTypeTag"],
    }),
    getYarnTypeById: build.query({
      query: (id) => ({
        url: `yarn_types/${id}`,
        method: "GET",
      }),
      providesTags: ["YarnTypeTag"],
    }),
    postYarnType: build.mutation({
      query: (data) => ({
        url: "yarn_types",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["YarnTypeTag"],
    }),
    putYarnType: build.mutation({
      query: (data) => ({
        url: `yarn_types/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["YarnTypeTag"],
    }),
    getYarnTypeList: build.query({
      query: () => ({
        url: `yarn_type_list`,
        method: "GET",
      }),
      providesTags: ["YarnTypeTag"],
    }),
    getSingleYarnTypeData: build.query({
      query: (data) => ({
        url: `single_yarn_type_data/${data}`,
        method: "GET",
      }),
      providesTags: ["YarnTypeTag"],
    }),
  }),
});

export const {
  useGetYarnTypeQuery,
  useGetYarnTypeByIdQuery,
  usePostYarnTypeMutation,
  usePutYarnTypeMutation,
  useGetYarnTypeListQuery,
  useGetSingleYarnTypeDataQuery,
} = YarnTypeApi;
