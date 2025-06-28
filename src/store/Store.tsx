import { configureStore } from "@reduxjs/toolkit";
import { CustomerApi } from "../api/CustomerApi";
import { StateSlice } from "../slice/state-slice";


export const store = configureStore({
  reducer : {
    StateCode : StateSlice.reducer,
    [CustomerApi.reducerPath] : CustomerApi.reducer,
  },
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        CustomerApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;