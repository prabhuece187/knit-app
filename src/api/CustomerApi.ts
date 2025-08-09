import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CustomerApi = createApi({
  reducerPath: "CustomerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://knitting.coderplays.com/api/",
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
    getCustomerList: build.query({
      query: () => ({
        url: `customer_list`,
        method: "GET",
      }),
      providesTags: ["CustomerTag"],
    }),
    getSingleCustomerData: build.query({
      query: (data) => ({
        url: `single_customer_data/${data}`,
        method: "GET",
      }),
      providesTags: ["CustomerTag"],
    }),
  }),
});

export const {
  useGetCustomerQuery,
  useGetCustomerByIdQuery,
  usePostCustomerMutation,
  usePutCustomerMutation,
  useGetCustomerListQuery,
  useGetSingleCustomerDataQuery,
} = CustomerApi;
