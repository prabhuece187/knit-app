import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";
import type {
    Professional,
    CreateProfessional,
    UpdateProfessional,
    ProfessionalQuery,
    UpdateSocialAndSEO,
} from "../schema-types/professional-schema";
import type {
    PaginatedResponse,
    CreateResponse,
    UpdateResponse,
    DeleteResponse,
    SuccessResponse,
} from "@/schema-types/pagination-schema";

export const ProfessionalApi = createApi({
    reducerPath: "ProfessionalApi",
    baseQuery: customFetchBase,
    tagTypes: ["ProfessionalTag"],
    endpoints: (build) => ({
        getProfessionals: build.query<
            PaginatedResponse<Professional>,
            ProfessionalQuery
        >({
            query: (params) => ({
                url: "professionals",
                method: "GET",
                params,
            }),
            providesTags: ["ProfessionalTag"],
        }),
        getProfessionalById: build.query<Professional, number>({
            query: (id) => ({
                url: `professionals/${id}`,
                method: "GET",
            }),
            providesTags: ["ProfessionalTag"],
        }),
        getProfessionalByUserId: build.query<Professional, number>({
            query: (userId) => ({
                url: `professionals/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["ProfessionalTag"],
        }),
        createProfessional: build.mutation<
            CreateResponse<Professional>,
            CreateProfessional
        >({
            query: (data) => ({
                url: "professionals",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ProfessionalTag"],
        }),
        updateProfessional: build.mutation<
            UpdateResponse<Professional>, UpdateProfessional>({
                query: ({ id, ...data }) => ({
                    url: `professionals/${id}`,
                    method: "PATCH",
                    body: data,
                }),
                invalidatesTags: ["ProfessionalTag"],
            }),
        deleteProfessional: build.mutation<DeleteResponse, number>({
            query: (id) => ({
                url: `professionals/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfessionalTag"],
        }),
        updateSocialAndSEO: build.mutation<
            SuccessResponse, UpdateSocialAndSEO>({
                query: ({ id, ...data }) => ({
                    url: `professionals/${id}/social-and-seo`,
                    method: "PATCH",
                    body: data,
                }),
                invalidatesTags: ["ProfessionalTag"],
            }),
    }),
});

export const {
    useGetProfessionalsQuery,
    useGetProfessionalByIdQuery,
    useGetProfessionalByUserIdQuery,
    useCreateProfessionalMutation,
    useUpdateProfessionalMutation,
    useUpdateSocialAndSEOMutation,
    useDeleteProfessionalMutation,
} = ProfessionalApi;
