import { configureStore } from "@reduxjs/toolkit";
import { CustomerApi } from "../api/CustomerApi";
import { StateSlice } from "../slice/state-slice";
import { StateApi } from "@/api/StateApi";
import { ItemApi } from "@/api/ItemApi";
import { YarnTypeApi } from "@/api/YarnTypeApi";
import { InwardApi } from "@/api/InwardApi";
import { OutwardApi } from "@/api/OutwardApi";
import { ReportApi } from "@/api/ReportApi";
import { MillApi } from "@/api/MillApi";
import { InvoiceApi } from "@/api/InvoiceApi";

export const store = configureStore({
  reducer: {
    StateCode: StateSlice.reducer,
    [CustomerApi.reducerPath]: CustomerApi.reducer,
    [ItemApi.reducerPath]: ItemApi.reducer,
    [MillApi.reducerPath]: MillApi.reducer,
    [StateApi.reducerPath]: StateApi.reducer,
    [YarnTypeApi.reducerPath]: YarnTypeApi.reducer,
    [InwardApi.reducerPath]: InwardApi.reducer,
    [OutwardApi.reducerPath]: OutwardApi.reducer,
    [InvoiceApi.reducerPath]: InvoiceApi.reducer,
    [ReportApi.reducerPath]: ReportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      CustomerApi.middleware,
      ItemApi.middleware,
      MillApi.middleware,
      StateApi.middleware,
      YarnTypeApi.middleware,
      InwardApi.middleware,
      OutwardApi.middleware,
      InvoiceApi.middleware,
      ReportApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
