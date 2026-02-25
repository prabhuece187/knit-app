import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import invoiceFormReducer from "@/slice/InvoiceFormSlice";
import paymentFormReducer from "@/slice/PaymentFormSlice";
import { BankApi } from "@/api/BankApi";
import { PaymentApi } from "@/api/PaymentApi";
import { ProductionReturnApi } from "@/api/ProductionReturnApi";
import { JobMasterApi } from "@/api/JobMasterApi";
import { KnittingMachineApi } from "@/api/KnittingMachineApi";
import { KnittingProductionApi } from "@/api/KnittingProductionApi";
import { KnittingReworkApi } from "@/api/ProductionReworkApi";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/slice/AuthSlice";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  invoiceForm: invoiceFormReducer,
  paymentForm: paymentFormReducer,
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
  [BankApi.reducerPath]: BankApi.reducer,
  [PaymentApi.reducerPath]: PaymentApi.reducer,
  [ProductionReturnApi.reducerPath]: ProductionReturnApi.reducer,
  [JobMasterApi.reducerPath]: JobMasterApi.reducer,
  [KnittingMachineApi.reducerPath]: KnittingMachineApi.reducer,
  [KnittingProductionApi.reducerPath]: KnittingProductionApi.reducer,
  [KnittingReworkApi.reducerPath]: KnittingReworkApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      CustomerApi.middleware,
      ItemApi.middleware,
      MillApi.middleware,
      StateApi.middleware,
      YarnTypeApi.middleware,
      InwardApi.middleware,
      OutwardApi.middleware,
      InvoiceApi.middleware,
      ReportApi.middleware,
      BankApi.middleware,
      PaymentApi.middleware,
      ProductionReturnApi.middleware,
      JobMasterApi.middleware,
      KnittingMachineApi.middleware,
      KnittingProductionApi.middleware,
      KnittingReworkApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);