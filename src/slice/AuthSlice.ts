// src/slice/AuthSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addTokensAndUser: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.sessionExpired = false;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    removeTokensAndUser: (state) => {
      state.accessToken = null;
      state.user = null;
      state.sessionExpired = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
    },

    updateUserReducer: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const {
  addTokensAndUser,
  removeTokensAndUser,
  setSessionExpired,
  updateUserReducer,
} = authSlice.actions;

export default authSlice.reducer;
