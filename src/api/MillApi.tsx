import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const MillApi = createApi({
  reducerPath: "MillApi",
  baseQuery: fetchBaseQuery({
   baseUrl: "http://knitting.coderplays.com/api/",
  }),
  tagTypes: ["MillTag"],
  endpoints: (build) => ({
    getMill: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `mills?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
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
  }),
});

export const {
useGetMillQuery,
useGetMillByIdQuery,
usePostMillMutation,
usePutMillMutation,
useGetMillListQuery,
} = MillApi;
