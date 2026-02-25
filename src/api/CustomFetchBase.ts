import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { addTokensAndUser, setSessionExpired } from "@/slice/AuthSlice";
import type { User } from "@/slice/AuthSlice";

import type { QueryReturnValue } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "@/store/Store";

const mutex = new Mutex();
const baseUrl = import.meta.env.VITE_API_URL as string;


const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth?.accessToken;
    if (accessToken) {
      headers.set("authorization", accessToken ? `Bearer ${accessToken}` : "");
    }
    return headers;
  },
});

const customFetchBase: BaseQueryFn<FetchArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock(); // Wait for any ongoing refresh to finish

  let result: QueryReturnValue = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire(); // Acquire the mutex
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken;
        const employeeId = state.auth?.user?.id;

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: {
                refreshToken,
                userId: employeeId,
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            // Update tokens in state
            api.dispatch(
              addTokensAndUser(
                refreshResult.data as {
                  accessToken: string;
                  refreshToken: string;
                  user: User;
                }
              )
            );

            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Handle refresh token failure (e.g., session expired)
            api.dispatch(setSessionExpired(true));
          }
        } else {
          // No refresh token available, session expired
          api.dispatch(setSessionExpired(true));
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
        api.dispatch(setSessionExpired(true));
      } finally {
        release(); // Always release the mutex
      }
    } else {
      // If the mutex is locked, wait for the refresh process to complete
      await mutex.waitForUnlock();
      // Retry the original query with the new tokens
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default customFetchBase;
