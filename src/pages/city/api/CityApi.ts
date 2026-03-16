import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";
import type { CityQuery } from "../schema-types/city-schema";
import type { City } from "../schema-types/city-schema";
import type {
  PaginatedResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
} from "@/schema-types/pagination-schema";

export const CityApi = createApi({
  reducerPath: "CityApi",
  baseQuery: customFetchBase,
  tagTypes: ["CityTag"],
  endpoints: (build) => ({
    getCities: build.query<PaginatedResponse<City>, CityQuery>({
      query: (params) => ({
        url: "city",
        method: "GET",
        params,
      }),
      providesTags: ["CityTag"],
    }),
    getCityById: build.query<City, number>({
      query: (id) => ({
        url: `city/${id}`,
        method: "GET",
      }),
      providesTags: ["CityTag"],
    }),
    createCity: build.mutation<CreateResponse<City>, Partial<City>>({
      query: (data) => ({
        url: "city",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CityTag"],
    }),
    updateCity: build.mutation<
      UpdateResponse<City>,
      { id: number; data: Partial<City> }
    >({
      query: ({ id, data }) => ({
        url: `city/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CityTag"],
    }),
    deleteCity: build.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CityTag"],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = CityApi;
