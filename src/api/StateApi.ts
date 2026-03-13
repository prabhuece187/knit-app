import type { State, StateQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./CustomFetchBase";


export const StateApi = createApi({
  reducerPath: "StateApi",
  baseQuery: customFetchBase,
  tagTypes: ["StateTag"],
  endpoints: (build) => ({
    getState: build.query<PaginatedResponse<State>, StateQuery>({
      query: (params) => ({
        url: "states",
        method: "GET",
        params,
      }),
      providesTags: ["StateTag"],
    }),
    getStateById: build.query({
      query: (id) => ({
        url: `states/${id}`,
        method: "GET",
      }),
      providesTags: ["StateTag"],
    }),
    postState: build.mutation({
      query: (data) => ({
        url: "states",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["StateTag"],
    }),
    PatchState: build.mutation({
      query: (data) => ({
        url: `states/${data.id}`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["StateTag"],
    }),
    getStateList: build.query({
      query: () => ({
        url: `states`,
        method: "GET",
      }),
      providesTags: ["StateTag"],
    }),
    deleteState: build.mutation({
      query: (id) => ({
        url: `states/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StateTag"],
    }),
  }),
});

export const {
  useGetStateQuery,
  useGetStateByIdQuery,
  usePostStateMutation,
  usePatchStateMutation,
  useGetStateListQuery,
  useDeleteStateMutation,
} = StateApi; 
