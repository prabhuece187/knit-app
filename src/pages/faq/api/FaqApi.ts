import type {
  CreateFaqPayload,
  Faq,
  FaqQueryParams,
  UpdateFaqPayload,
} from "@/pages/faq/schema-types/faq.schema";
import type {
  CreateResponse,
  DeleteResponse,
  PaginatedResponse,
  UpdateResponse,
} from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";

export const FaqApi = createApi({
  reducerPath: "FaqApi",
  baseQuery: customFetchBase,
  tagTypes: ["FaqTag"],
  endpoints: (build) => ({
    getFaqs: build.query<PaginatedResponse<Faq>, FaqQueryParams>({
      query: (params) => ({
        url: "faqs",
        method: "GET",
        params,
      }),
      providesTags: ["FaqTag"],
    }),
    getFaqById: build.query<Faq, number>({
      query: (id) => ({
        url: `faqs/${id}`,
        method: "GET",
      }),
      providesTags: ["FaqTag"],
    }),
    createFaq: build.mutation<CreateResponse<Faq>, CreateFaqPayload>({
      query: (body) => ({
        url: "faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FaqTag"],
    }),
    updateFaq: build.mutation<
      UpdateResponse<Faq>,
      { id: number; data: UpdateFaqPayload }
    >({
      query: ({ id, data }) => ({
        url: `faqs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FaqTag"],
    }),
    deleteFaq: build.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FaqTag"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = FaqApi;
