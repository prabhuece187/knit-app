import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";
import type {
    Professional,
    ProfessionalResponse,
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
    tagTypes: ["Professional"],
    endpoints: (build) => ({
        getProfessionals: build.query<
            PaginatedResponse<ProfessionalResponse>,
            ProfessionalQuery
        >({
            query: (params) => ({
                url: "professionals",
                method: "GET",
                params,
            }),
            providesTags: ["Professional"],
        }),
        getProfessionalById: build.query<Professional, number>({
            query: (id) => ({
                url: `professionals/${id}`,
                method: "GET",
            }),
            providesTags: ["Professional"],
        }),
        getProfessionalByUserId: build.query<ProfessionalResponse, void>({
            query: () => ({
                url: `professionals/user`,
                method: "GET",
            }),
            providesTags: ["Professional"],
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
            invalidatesTags: ["Professional"],
        }),
        updateProfessional: build.mutation<
            UpdateResponse<Professional>, UpdateProfessional>({
                query: ({ id, ...data }) => ({
                    url: `professionals/${id}`,
                    method: "PATCH",
                    body: data,
                }),
                invalidatesTags: ["Professional"],
            }),
        deleteProfessional: build.mutation<DeleteResponse, number>({
            query: (id) => ({
                url: `professionals/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Professional"],
        }),
        updateSocialAndSEO: build.mutation<
            SuccessResponse, UpdateSocialAndSEO>({
                query: ({ id, ...data }) => ({
                    url: `professionals/${id}/social-and-seo`,
                    method: "PATCH",
                    body: data,
                }),
                invalidatesTags: ["Professional"],
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
