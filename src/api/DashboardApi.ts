import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/helper/ApiFetchBase";

export interface DashboardSummary {
  total_customers: number;
  today_inward_weight: number;
  active_jobs: number;
  today_dispatch: number;
  today_invoice: number;
  today_collection: number;
  pending_amount: number;
}

export interface ProductionChart {
  date: string;
  total: number;
}

export interface TopCustomer {
  customer_name: string;
  total_weight: number;
}

export interface RecentInward {
  id: number;
  inward_no: string;
  created_at: string;
}

export interface RecentJob {
  id: number;
  job_card_no: string;
  created_at: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  production_chart: ProductionChart[];
  top_customers: TopCustomer[];
  recent_inwards: RecentInward[];
  recent_jobs: RecentJob[];
}

export const DashboardApi = createApi({
  reducerPath: "DashboardApi",
  baseQuery: baseQuery,
  tagTypes: ["DashboardTag"],

  endpoints: (build) => ({
    /* ===============================
       Dashboard Main Data
    =============================== */

    getDashboard: build.query<DashboardResponse, void>({
      query: () => ({
        url: "dashboard",
        method: "GET",
      }),
      providesTags: ["DashboardTag"],
    }),
  }),
});

export const { useGetDashboardQuery } = DashboardApi;
