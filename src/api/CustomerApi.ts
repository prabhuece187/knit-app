import { baseQuery } from "@/helper/ApiFetchBase";
import type { Customer, CustomerQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi, } from "@reduxjs/toolkit/query/react";
export const CustomerApi = createApi({
  reducerPath: "CustomerApi",
   baseQuery: baseQuery,
  tagTypes: ["CustomerTag"],
  endpoints: (build) => ({
    getCustomer: build.query<PaginatedResponse<Customer>, CustomerQuery>({
      query: (params) => ({
        url: "customers",
        method: "GET",
        params, // ✅ RTK Query builds query string
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
