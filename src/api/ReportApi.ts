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
  }),
});

export const { usePostOverAllReportMutation } = ReportApi;
