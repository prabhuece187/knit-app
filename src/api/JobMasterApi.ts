import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { JobMaster, JobMasterQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";

const baseUrl = import.meta.env.VITE_API_URL as string;

export const JobMasterApi = createApi({
  reducerPath: "JobMasterApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["JobTag"],
  endpoints: (build) => ({
    getJobs: build.query<PaginatedResponse<JobMaster>, JobMasterQuery>({
      query: (params) => ({
        url: "job-master",
        method: "GET",
        params,
      }),
      providesTags: ["JobTag"],
    }),

    getNextJobNo: build.query<{ job_no: string }, void>({
      query: () => "/job-masters/next-job-no",
    }),

    getJobById: build.query<JobMaster, number>({
      query: (id) => `job-master/${id}`,
      providesTags: ["JobTag"],
    }),

    postJob: build.mutation<JobMaster, Partial<JobMaster>>({
      query: (body) => ({
        url: "job-master/",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["JobTag"],
    }),

    putJob: build.mutation<JobMaster, JobMaster>({
      query: (body) => ({
        url: `job-master/${body.id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["JobTag"],
    }),

    getJobList: build.query({
      query: () => ({
        url: `job_list`,
        method: "GET",
      }),
      providesTags: ["JobTag"],
    }),

    deleteJob: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `job-master/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobTag"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetNextJobNoQuery,
  useGetJobByIdQuery,
  usePostJobMutation,
  usePutJobMutation,
  useDeleteJobMutation,
  useGetJobListQuery,
} = JobMasterApi;
