import type { InvoiceItem } from "@/schema-types/paymennt-schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL as string;
export const PaymentApi = createApi({
  reducerPath: "PaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["PaymentTag"],
  endpoints: (build) => ({
    getPayment: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `payments?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
      }),
      providesTags: ["PaymentTag"],
    }),
    getPaymentById: build.query({
      query: (id) => ({
        url: `payments/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentTag"],
    }),
    postPayment: build.mutation({
      query: (data) => ({
        url: "payment_add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["PaymentTag"],
    }),
    putPayment: build.mutation({
      query: (data) => ({
        url: `payment_update/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["PaymentTag"],
    }),
    deletePayment: build.mutation<void, number>({
      query: (id) => ({
        url: `payment_delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentTag"],
    }),
    getCustomerInvoices: build.query<
      { invoices: InvoiceItem[] },
      { customer_id: number }
    >({
      query: ({ customer_id }) => ({
        url: `customer-invoices/${customer_id}`,
        method: "GET",
      }),
      providesTags: ["PaymentTag"],
    }),
  }),
});

export const {
  useGetPaymentQuery,
  useGetPaymentByIdQuery,
  usePostPaymentMutation,
  usePutPaymentMutation,
  useDeletePaymentMutation,
  useGetCustomerInvoicesQuery,
} = PaymentApi;
