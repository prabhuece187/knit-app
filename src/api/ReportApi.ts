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
    postItemStockReportCUstomerWise: build.mutation({
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
  }),
});

export const {
  usePostOverAllReportMutation,
  usePostAllDetailReportMutation,
  usePostCustomerLedgerInOutMutation,
  usePostCustomerInOutItemWiseMutation,
  usePostItemStockReportMutation,
  usePostItemStockReportCUstomerWiseMutation,
  usePostMillLedgerInOutMutation,
  usePostMillLedgerItemWiseMutation,
  usePostYarnTypeLedgerMutation,
} = ReportApi;
