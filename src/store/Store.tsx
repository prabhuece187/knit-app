import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { CustomerApi } from "../api/CustomerApi";
import { StateSlice } from "../slice/state-slice";
import { StateApi } from "@/pages/state/api/StateApi";
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
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { AuthApi } from "@/pages/auth/api/AuthApi";
import { CategoryApi } from "@/api/CategoryApi";
import { SubCategoryApi } from "@/api/SubCategoryApi";
import { DistrictApi } from "@/pages/district/api/DistrictApi";
import { CityApi } from "@/pages/city/api/CityApi";
import { ProfessionalApi } from "@/pages/professional/api/ProfessionalApi";
import { ReviewApi } from "@/pages/reviews/api/ReviewsApi";
import { FaqApi } from "@/pages/faq/api/FaqApi";


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
  [AuthApi.reducerPath]: AuthApi.reducer,
  [CategoryApi.reducerPath]: CategoryApi.reducer,
  [SubCategoryApi.reducerPath]: SubCategoryApi.reducer,
  [CustomerApi.reducerPath]: CustomerApi.reducer,
  [ItemApi.reducerPath]: ItemApi.reducer,
  [MillApi.reducerPath]: MillApi.reducer,
  [StateApi.reducerPath]: StateApi.reducer,
  [DistrictApi.reducerPath]: DistrictApi.reducer,
  [CityApi.reducerPath]: CityApi.reducer,
  [ProfessionalApi.reducerPath]: ProfessionalApi.reducer,
  [ReviewApi.reducerPath]: ReviewApi.reducer,
  [FaqApi.reducerPath]: FaqApi.reducer,
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
      AuthApi.middleware,
      CategoryApi.middleware,
      SubCategoryApi.middleware,
      CustomerApi.middleware,
      ItemApi.middleware,
      MillApi.middleware,
      StateApi.middleware,
      DistrictApi.middleware,
      CityApi.middleware,
      ProfessionalApi.middleware,
      ReviewApi.middleware,
      FaqApi.middleware,
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


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;