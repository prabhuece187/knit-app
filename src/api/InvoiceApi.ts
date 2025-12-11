import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL as string;
export const InvoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["InvoiceTag"],
  endpoints: (build) => ({
    getInvoice: build.query({
      query: ({ limit, offset, curpage, searchInput }) => ({
        url: `invoice?limit=${limit}&offset=${offset}&curpage=${curpage}&searchInput=${searchInput}`,
        method: "GET",
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
