import type {
    Review,
    ReviewQueryType,
    UpdateReviewPayload,
} from "@/pages/reviews/schema-types/review.schema";
import type { PaginatedResponse } from "@/schema-types/pagination-schema";
import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../../../api/CustomFetchBase";

export const ReviewApi = createApi({
    reducerPath: "ReviewApi",
    baseQuery: customFetchBase,
    tagTypes: ["ReviewTag"],
    endpoints: (build) => ({
        getReviews: build.query<PaginatedResponse<Review>, ReviewQueryType>({
            query: (params) => ({
                url: "review",
                method: "GET",
                params,
            }),
            providesTags: ["ReviewTag"],
        }),
        getReview: build.query({
            query: (id) => ({
                url: `review/${id}`,
                method: "GET",
            }),
            providesTags: ["ReviewTag"],
        }),
        approveReview: build.mutation({
            query: (id) => ({
                url: `review/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["ReviewTag"],
        }),
        rejectReview: build.mutation({
            query: (id) => ({
                url: `review/${id}/reject`,
                method: "PATCH",
            }),
            invalidatesTags: ["ReviewTag"],
        }),
        toggleTestimonial: build.mutation({
            query: (id) => ({
                url: `review/${id}/toggle-testimonial`,
                method: "PATCH",
            }),
            invalidatesTags: ["ReviewTag"],
        }),
        deleteReview: build.mutation({
            query: (id) => ({
                url: `review/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ReviewTag"],
        }),
        updateReview: build.mutation<Review, { id: number } & UpdateReviewPayload>({
            query: ({ id, ...body }) => ({
                url: `review/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["ReviewTag"],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useGetReviewQuery,
    useApproveReviewMutation,
    useRejectReviewMutation,
    useToggleTestimonialMutation,
    useDeleteReviewMutation,
    useUpdateReviewMutation,
} = ReviewApi; 
