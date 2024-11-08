// store/slices/splashSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SplashState {
  splashAnimationFinished: boolean;
}

const initialState: SplashState = {
  splashAnimationFinished: false,
};

const splashSlice = createSlice({
  name: "splash",
  initialState,
  reducers: {
    setSplashAnimationFinished: (state, action: PayloadAction<boolean>) => {
      state.splashAnimationFinished = action.payload;
    },
  },
});

export const { setSplashAnimationFinished } = splashSlice.actions;
export default splashSlice.reducer;
