import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const OutwardApi = createApi({
  reducerPath: "outwardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://knitting.coderplays.com/api/",
  }),
  tagTypes: ["OutwardTag"],
  endpoints: (build) => ({
    getOutward: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `outward?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
      }),
      providesTags: ["OutwardTag"],
    }),
    getOutwardById: build.query({
      query: (id) => ({
        url: `outward_edit/${id}`,
        method: "GET",
      }),
      providesTags: ["OutwardTag"],
    }),
    postOutward: build.mutation({
      query: (data) => ({
        url: "outward_add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["OutwardTag"],
    }),
    putOutward: build.mutation({
      query: (data) => ({
        url: `outward_update/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["OutwardTag"],
    }),
  }),
});

export const {
  useGetOutwardQuery,
  useGetOutwardByIdQuery,
  usePostOutwardMutation,
  usePutOutwardMutation,
} = OutwardApi;
