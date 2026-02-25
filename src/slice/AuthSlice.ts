import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
  firstName: string;
  image: string;
  employeeCode: string;
  role?: string; // Optional since API response may not always include role
  _count: {
    Post: number;
  };
  department: {
    id: number | string;
  };
  subscriptionId: string | null;
  subscriptionType?: string;
  subscriptionStatus?: string;
  isVerified?: boolean;
  registrationStep?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  sessionExpired: boolean;
  status: number;
  message: string;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  sessionExpired: false,
  status: 0,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addTokensAndUser: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user;
      state.sessionExpired = false;
    },
    removeTokensAndUser: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setSessionExpired: (state, { payload }) => {
      state.sessionExpired = payload;
    },
    updateUserSubscription: (state, { payload }) => {
      if (state.user) {
        state.user.subscriptionId = payload.subscriptionId;
        state.user.subscriptionType = payload.subscriptionType;
        state.user.subscriptionStatus = payload.subscriptionStatus;
      }
    },
    updateUserInfo: (state, { payload }) => {
      if (state.user) {
        state.user = { ...state.user, ...payload };
      }
    },
  },
});

export const {
  addTokensAndUser,
  removeTokensAndUser,
  setSessionExpired,
  updateUserSubscription,
  updateUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
