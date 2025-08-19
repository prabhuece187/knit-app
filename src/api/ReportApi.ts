import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ReportApi = createApi({
  reducerPath: "ReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://knitting.coderplays.com/api/",
    // baseUrl: "http://localhost:8000/api/",
  }),
  tagTypes: ["ReportTag"],
  endpoints: (build) => ({
    postOverAllReport: build.mutation({
      query: (data) => ({
        url: "over-all-report",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postAllDetailReport: build.mutation({
      query: (data) => ({
        url: "over-all-detail-report",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postCustomerLedgerInOut: build.mutation({
      query: (data) => ({
        url: "customer-ledger-inout",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postCustomerInOutItemWise: build.mutation({
      query: (data) => ({
        url: "customer-ledger-itemwise",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postCustomerIndividualItem: build.mutation({
      query: (data) => ({
        url: "customer-individual-item",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postItemStockReport: build.mutation({
      query: (data) => ({
        url: "item-stock-report",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postItemStockReportCustomerWise: build.mutation({
      query: (data) => ({
        url: "item-stock-customerwise",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postItemIndividualCustomer: build.mutation({
      query: (data) => ({
        url: "item-individual-customer",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postMillLedgerInOut: build.mutation({
      query: (data) => ({
        url: "mill-ledger-inout",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postMillLedgerItemWise: build.mutation({
      query: (data) => ({
        url: "mill-ledger-itemwise",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postMillIndividualItem: build.mutation({
      query: (data) => ({
        url: "mill-individual-item",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postYarnTypeLedger: build.mutation({
      query: (data) => ({
        url: "yarn-type-ledger",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
    postYarnTypeIndividualCustomer: build.mutation({
      query: (data) => ({
        url: "yarn-individual-customer",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ReportTag"],
    }),
  }),
});

export const {
  usePostOverAllReportMutation,
  usePostAllDetailReportMutation,
  usePostCustomerLedgerInOutMutation,
  usePostCustomerInOutItemWiseMutation,
  usePostCustomerIndividualItemMutation,
  usePostItemStockReportMutation,
  usePostItemStockReportCustomerWiseMutation,
  usePostItemIndividualCustomerMutation,
  usePostMillLedgerInOutMutation,
  usePostMillLedgerItemWiseMutation,
  usePostMillIndividualItemMutation,
  usePostYarnTypeLedgerMutation,
  usePostYarnTypeIndividualCustomerMutation,
} = ReportApi;
