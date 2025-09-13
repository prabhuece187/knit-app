import { configureStore } from "@reduxjs/toolkit";
import { CustomerApi } from "../api/CustomerApi";
import { StateApi } from "@/api/StateApi";

import { ReportApi } from "@/api/ReportApi";

export const store = configureStore({
  reducer: {
    [CustomerApi.reducerPath]: CustomerApi.reducer,
    [StateApi.reducerPath]: StateApi.reducer,
    [ReportApi.reducerPath]: ReportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      CustomerApi.middleware,
      StateApi.middleware,
      ReportApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
