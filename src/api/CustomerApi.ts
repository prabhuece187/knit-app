
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CustomerApi = createApi({
  reducerPath: "CustomerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  tagTypes: ["CustomerTag"],
  endpoints: (build) => ({
    getCustomer: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `customers?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
      }),
      providesTags: ["CustomerTag"],
    }),
    getCustomerById: build.query({
      query: (id) => ({
        url: `customers/${id}`,
        method: "GET",
      }),
      providesTags: ["CustomerTag"],
    }),
    postCustomer: build.mutation({
      query: (data) => ({
        url: "customers",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["CustomerTag"],
    }),
    putCustomer: build.mutation({
      query: (data) => ({
        url: `customers/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["CustomerTag"],
    }),
  }),
});

export const {
  useGetCustomerQuery,
  useGetCustomerByIdQuery,
  usePostCustomerMutation,
  usePutCustomerMutation,
} = CustomerApi;



