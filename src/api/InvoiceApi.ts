import { baseQuery } from "@/helper/ApiFetchBase";
import type { Invoice, InvoiceQuery } from "@/schema-types/invoice-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";

export const InvoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: baseQuery,
  tagTypes: ["InvoiceTag"],
  endpoints: (build) => ({
    getInvoice: build.query<PaginatedResponse<Invoice>, InvoiceQuery>({
      query: (params) => ({
        url: "invoice",
        method: "GET",
        params,
      }),
      providesTags: ["InvoiceTag"],
    }),
    getInvoiceById: build.query({
      query: (invoiceId) => ({
        url: `invoice_edit/${invoiceId}`,
        method: "GET",
      }),
      providesTags: ["InvoiceTag"],
    }),
    postInvoice: build.mutation({
      query: (data) => ({
        url: "invoice_add",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["InvoiceTag"],
    }),
    putInvoice: build.mutation({
      query: (data) => ({
        url: `invoice_update/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["InvoiceTag"],
    }),
    deleteInvoice: build.mutation({
      query: (id) => ({
        url: `invoice_delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InvoiceTag"],
    }),
  }),
});

export const {
  useGetInvoiceQuery,
  useGetInvoiceByIdQuery,
  usePostInvoiceMutation,
  usePutInvoiceMutation,
  useDeleteInvoiceMutation,
} = InvoiceApi;
