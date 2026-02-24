import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { KnittingMachine, KnittingMachineQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";

const baseUrl = import.meta.env.VITE_API_URL as string;

export const KnittingMachineApi = createApi({
  reducerPath: "KnittingMachineApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["KnittingMachineTag"],
  endpoints: (build) => ({
    getKnittingMachine: build.query<
      PaginatedResponse<KnittingMachine>,
      KnittingMachineQuery
    >({
      query: (params) => ({
        url: "knitting-machines",
        method: "GET",
        params, // ✅ RTK Query builds query string
      }),
      providesTags: ["KnittingMachineTag"],
    }),

    getKnittingMachineById: build.query<KnittingMachine, number>({
      query: (id) => ({
        url: `knitting-machines/${id}`,
        method: "GET",
      }),
      providesTags: ["KnittingMachineTag"],
    }),

    postKnittingMachine: build.mutation<
      KnittingMachine,
      Partial<KnittingMachine>
    >({
      query: (data) => ({
        url: "knitting-machines",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KnittingMachineTag"],
    }),

    putKnittingMachine: build.mutation<KnittingMachine, KnittingMachine>({
      query: (data) => ({
        url: `knitting-machines/${data.id}`,
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["KnittingMachineTag"],
    }),

    getMachineSelectList: build.query<KnittingMachine[], void>({
      query: () => ({
        url: "machine-select-list",
        method: "GET",
      }),
      providesTags: ["KnittingMachineTag"],
    }),
  }),
});

export const {
  useGetKnittingMachineQuery,
  useGetKnittingMachineByIdQuery,
  usePostKnittingMachineMutation,
  usePutKnittingMachineMutation,
  useGetMachineSelectListQuery,
} = KnittingMachineApi;
