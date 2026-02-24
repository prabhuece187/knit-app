import type { Item, ItemQuery } from "@/schema-types/master-schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_URL as string;
export const ItemApi = createApi({
  reducerPath: "ItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["ItemTag"],
  endpoints: (build) => ({
    getItem: build.query<PaginatedResponse<Item>, ItemQuery>({
      query: (params) => ({
        url: "items",
        method: "GET",
        params, // ✅ RTK Query builds query string
      }),
      providesTags: ["ItemTag"],
    }),
    getItemById: build.query({
      query: (id) => ({
        url: `items/${id}`,
        method: "GET",
      }),
      providesTags: ["ItemTag"],
    }),
    postItem: build.mutation({
      query: (data) => ({
        url: "items",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ItemTag"],
    }),
    putItem: build.mutation({
      query: (data) => ({
        url: `items/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["ItemTag"],
    }),
    getItemList: build.query({
      query: () => ({
        url: `item_list`,
        method: "GET",
      }),
      providesTags: ["ItemTag"],
    }),
    getSingleItemData: build.query({
      query: (data) => ({
        url: `single_item_data/${data}`,
        method: "GET",
      }),
      providesTags: ["ItemTag"],
    }),
  }),
});

export const {
  useGetItemQuery,
  useGetItemByIdQuery,
  usePostItemMutation,
  usePutItemMutation,
  useGetItemListQuery,
  useGetSingleItemDataQuery,
} = ItemApi;
