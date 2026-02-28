import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  RequestOtpResponse,
  RequestOtpRequest,
  LoginResponse,
  ValidateOtpRequest,
  RefreshTokenRequest,
  LogoutResponse,
  LogoutRequest,
  CurrentUserResponse,
  ProfessionalDetailResponse,
  ProfessionalDetailRequest,
  SurveyDetailResponse,
  SurveyDetailRequest,
  RegistrationStatusResponse,
  RegistrationStatusQueryParams,
  SavedProfessionalDetailsResponse,
  AdminRequestOtpResponse,
  AdminRequestOtpRequest,
  AdminValidateOtpResponse,
  AdminValidateOtpRequest,
} from "../types/auth.types";
import customFetchBase from "../../../api/CustomFetchBase";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: customFetchBase,
  tagTypes: ["Auth", "User", "Registration"],
  endpoints: (builder) => ({
    // Request OTP
    requestOtp: builder.mutation<RequestOtpResponse, RequestOtpRequest>({
      query: (args) => ({
        method: "POST",
        url: "auth/request-otp",
        body: args,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Validate OTP
    validateOtp: builder.mutation<LoginResponse, ValidateOtpRequest>({
      query: (args) => ({
        method: "POST",
        url: "auth/validate-otp",
        body: args,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
      query: (args) => ({
        method: "POST",
        url: "auth/refresh",
        body: args,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Logout
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (args) => ({
        method: "POST",
        url: "auth/logout",
        body: args,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get Current User
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        method: "POST",
        url: "auth/me",
      }),
      providesTags: ["User"],
    }),

    // Complete Professional Details (Registration Step 2)
    completeProfessionalDetails: builder.mutation<
      ProfessionalDetailResponse,
      { data: ProfessionalDetailRequest; email: string }
    >({
      query: ({ data, email }) => ({
        method: "POST",
        url: "auth/register-professional-detail",
        body: data,
        params: { email },
      }),
      invalidatesTags: ["Registration", "User"],
    }),

    // Complete Survey (Registration Step 3)
    completeSurvey: builder.mutation<
      SurveyDetailResponse,
      { data: SurveyDetailRequest; email: string }
    >({
      query: ({ data, email }) => ({
        method: "POST",
        url: "auth/register-survey-detail",
        body: data,
        params: { email },
      }),
      invalidatesTags: ["Registration", "User"],
    }),

    // Get Registration Status
    getRegistrationStatus: builder.query<
      RegistrationStatusResponse,
      RegistrationStatusQueryParams
    >({
      query: (args) => ({
        method: "GET",
        url: "auth/registration-status",
        params: args,
      }),
      providesTags: ["Registration"],
    }),

    // Get Saved Professional Details
    getSavedProfessionalDetails: builder.query<
      SavedProfessionalDetailsResponse,
      RegistrationStatusQueryParams
    >({
      query: (args) => ({
        method: "GET",
        url: "auth/saved-professional-details",
        params: args,
      }),
      providesTags: ["Registration"],
    }),

    // Admin Request OTP
    adminRequestOtp: builder.mutation<
      AdminRequestOtpResponse,
      AdminRequestOtpRequest
    >({
      query: (args) => ({
        method: "POST",
        url: "auth/admin/request-otp",
        body: args,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Admin Validate OTP
    adminValidateOtp: builder.mutation<
      AdminValidateOtpResponse,
      AdminValidateOtpRequest
    >({
      query: (args) => ({
        method: "POST",
        url: "auth/admin/validate-otp",
        body: args,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useValidateOtpMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useCompleteProfessionalDetailsMutation,
  useCompleteSurveyMutation,
  useGetRegistrationStatusQuery,
  useGetSavedProfessionalDetailsQuery,
  useAdminRequestOtpMutation,
  useAdminValidateOtpMutation,
} = AuthApi;
