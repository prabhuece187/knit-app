import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const YarnTypeApi = createApi({
  reducerPath: "YarnTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  tagTypes: ["YarnTypeTag"],
  endpoints: (build) => ({
    getYarnType: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `yarn_types?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
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
  }),
});

export const {
  useGetYarnTypeQuery,
  useGetYarnTypeByIdQuery,
  usePostYarnTypeMutation,
  usePutYarnTypeMutation,
  useGetYarnTypeListQuery,
} = YarnTypeApi;
