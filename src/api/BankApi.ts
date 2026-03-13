import { createApi } from "@reduxjs/toolkit/query/react";
import type { Bank, BankQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { baseQuery } from "@/helper/ApiFetchBase";

export const BankApi = createApi({
  reducerPath: "BankApi",
  baseQuery: baseQuery,
  tagTypes: ["BankTag"],
  endpoints: (build) => ({
    getBank: build.query<PaginatedResponse<Bank>, BankQuery>({
      query: (params) => ({
        url: "banks",
        method: "GET",
        params, // ✅ RTK Query builds query string
      }),
      providesTags: ["BankTag"],
    }),
    getBankById: build.query<Bank, number>({
      query: (id) => ({
        url: `banks/${id}`,
        method: "GET",
      }),
      providesTags: ["BankTag"],
    }),
    postBank: build.mutation<Bank, Partial<Bank>>({
      query: (data) => ({
        url: "banks",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["BankTag"],
    }),
    putBank: build.mutation<Bank, Bank>({
      query: (data) => ({
        url: `banks/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["BankTag"],
    }),
    getBankList: build.query<Bank[], void>({
      query: () => ({
        url: `bank_list`,
        method: "GET",
      }),
      providesTags: ["BankTag"],
    }),
    getSingleBankData: build.query<Bank, void>({
      query: () => ({
        url: `single_bank_data`,
        method: "GET",
      }),
      providesTags: ["BankTag"],
    }),
    putSetDefault: build.mutation<Bank, { id: number; is_default: boolean }>({
      query: ({ id, is_default }) => ({
        url: `set_default/${id}`,
        method: "PUT",
        body: { is_default },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["BankTag"],
    }),
  }),
});

export const {
  useGetBankQuery,
  useGetBankByIdQuery,
  usePostBankMutation,
  usePutBankMutation,
  usePutSetDefaultMutation,
  useGetBankListQuery,
  useGetSingleBankDataQuery,
} = BankApi;
