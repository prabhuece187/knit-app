import { baseQuery } from "@/helper/ApiFetchBase";
import type { State, StateQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";


export const StateApi = createApi({
  reducerPath: "StateApi",
  baseQuery: baseQuery,
  tagTypes: ["StateTag"],
  endpoints: (build) => ({
    getState: build.query<PaginatedResponse<State>, StateQuery>({
      query: (params) => ({
        url: "states",
        method: "GET",
        params, // ✅ RTK Query builds query string
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
    putState: build.mutation({
      query: (data) => ({
        url: `states/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["StateTag"],
    }),
    getStateList: build.query({
      query: () => ({
        url: `state_list`,
        method: "GET",
      }),
      providesTags: ["StateTag"],
    }),
  }),
});

export const {
  useGetStateQuery,
  useGetStateByIdQuery,
  usePostStateMutation,
  usePutStateMutation,
  useGetStateListQuery,
} = StateApi;
