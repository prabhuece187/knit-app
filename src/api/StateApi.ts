
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL as string;
console.log(baseUrl);
export const StateApi = createApi({
  reducerPath: "StateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["StateTag"],
  endpoints: (build) => ({
    getState: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `states?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
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



