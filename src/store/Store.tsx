import { configureStore } from "@reduxjs/toolkit";
import { CustomerApi } from "../api/CustomerApi";
import { StateSlice } from "../slice/state-slice";
import { StateApi } from "@/api/StateApi";


export const store = configureStore({
  reducer : {
    StateCode : StateSlice.reducer,
    [CustomerApi.reducerPath] : CustomerApi.reducer,
    [StateApi.reducerPath] :StateApi.reducer,
  },
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        CustomerApi.middleware,
        StateApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;