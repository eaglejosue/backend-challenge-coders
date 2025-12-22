import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Theme {
  Light = "light",
  Dark = "dark",
}
export interface AppState {
  theme: Theme;
  loading: boolean;
}
const INITIAL_STATE = {
  theme: Theme.Light,
  loading: false,
} as AppState;

const AppSlice = createSlice({
  name: "app",
  initialState: INITIAL_STATE,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTheme, setGlobalLoading } = AppSlice.actions;
export default AppSlice.reducer;
