// src/api/ApiFetchBase.ts

import {
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "@/store/Store";
import { removeTokensAndUser, setSessionExpired } from "@/slice/AuthSlice";

const mutex = new Mutex();

const baseUrl = import.meta.env.VITE_API_URL as string;

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth?.accessToken;
    console.log("FULL STATE:", accessToken);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

const ApiFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const result = await baseQuery(args, api, extraOptions);

  // 👇 Get URL safely
  const url = typeof args === "string" ? args : (args as FetchArgs).url;

  // 🔥 Ignore 401 for logout endpoint
  if (result.error?.status === 401 && url !== "logout") {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        api.dispatch(setSessionExpired(true));
        api.dispatch(removeTokensAndUser());
      } finally {
        release();
      }
    }
  }

  return result;
};

export default ApiFetchBase;
