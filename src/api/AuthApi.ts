import { createApi } from "@reduxjs/toolkit/query/react";

import { addTokensAndUser, removeTokensAndUser } from "@/slice/AuthSlice";
import ApiFetchBase from "@/helper/ApiFetchBase";

// const baseUrl = import.meta.env.VITE_API_URL as string;

/* =========================
   TYPES
========================= */

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/* 🔥 FIXED: match Laravel response */
export interface AuthResponse {
  token: string;
  user: User;
}

/* =========================
   API
========================= */

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: ApiFetchBase,
  tagTypes: ["AuthTag"],

  endpoints: (build) => ({
    /* ================= REGISTER ================= */
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            addTokensAndUser({
              accessToken: data.token, // ✅ FIXED
              user: data.user,
            }),
          );
        } catch {
          // handled by baseQuery
        }
      },

      invalidatesTags: ["AuthTag"],
    }),

    /* ================= LOGIN ================= */
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("🔥 LOGIN RESPONSE:", data);
          dispatch(
            addTokensAndUser({
              accessToken: data.token, // ✅ FIXED
              user: data.user,
            }),
          );
        } catch {
          // handled by baseQuery
        }
      },

      invalidatesTags: ["AuthTag"],
    }),

    /* ================= LOGOUT ================= */
    logout: build.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(removeTokensAndUser());
        }
      },

      invalidatesTags: ["AuthTag"],
    }),

    /* ================= GET AUTH USER ================= */
    getAuthUser: build.query<User, void>({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["AuthTag"],
    }),
  }),
});

/* =========================
   EXPORT HOOKS
========================= */

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetAuthUserQuery,
} = AuthApi;
