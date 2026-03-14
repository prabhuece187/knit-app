import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";
import type { DistrictQuery } from "../schema-types/district-schema";
import type { District } from "../schema-types/district-schema";
import type {
  PaginatedResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
} from "../../../schema-types/pagination-schema";

export const DistrictApi = createApi({
  reducerPath: "DistrictApi",
  baseQuery: customFetchBase,
  tagTypes: ["DistrictTag"],
  endpoints: (build) => ({
    getDistricts: build.query<PaginatedResponse<District>, DistrictQuery>({
      query: (params) => ({
        url: "district",
        method: "GET",
        params,
      }),
      providesTags: ["DistrictTag"],
    }),
    getDistrictById: build.query<District, number>({
      query: (id) => ({
        url: `district/${id}`,
        method: "GET",
      }),
      providesTags: ["DistrictTag"],
    }),
    createDistrict: build.mutation<CreateResponse<District>, Partial<District>>(
      {
        query: (data) => ({
          url: "district",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["DistrictTag"],
      }
    ),
    updateDistrict: build.mutation<
      UpdateResponse<District>,
      { id: number; data: Partial<District> }
    >({
      query: ({ id, data }) => ({
        url: `district/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DistrictTag"],
    }),
    deleteDistrict: build.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `district/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DistrictTag"],
    }),
    getDistrictList: build.query<District[], void>({
      query: () => ({
        url: `district_list`,
        method: "GET",
      }),
      providesTags: ["DistrictTag"],
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useGetDistrictListQuery,
} = DistrictApi;
