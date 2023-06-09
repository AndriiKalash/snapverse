import { configureStore } from "@reduxjs/toolkit";
import posts from "./posts/slice";
import auth from "./auth/slice";
import comments from "./comments/slice";

export const store = configureStore({
  reducer: {
    posts,
    auth,
    comments,
  },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
