import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchLoginUser = createAsyncThunk(
  "auth/fetchLoginUser",
  async (obj) => {
    const { data } = await axios.post("/auth/login", obj);
    return data;
  }
);

export const fetchRegisterUser = createAsyncThunk(
  "auth/fetchRegisterUser",
  async (obj) => {
    const { data } = await axios.post("/auth/register", obj);
    return data;
  }
);

//for complite this func should be token in window.localStorage:
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const asyncActions = [fetchRegisterUser, fetchLoginUser, fetchAuthMe];

const initialState = {
  user: null,
  statusUser: "loading",
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogOut(state) {
      state.user = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    asyncActions.map((action) =>
      builder
        .addCase(action.pending, (state) => {
          state.user = null;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.user = action.payload;
          state.statusUser = "idle";
          state.isAuth = true;
        })
        .addCase(action.rejected, (state) => {
          state.user = null;
          state.statusUser = "error";
        })
    );
    builder.addDefaultCase((state, action) => {});
  },
});

export const selectorAuthUser = (state) => state.auth;
export const { reducer, actions } = authSlice;
export const { setLogOut } = actions;
export default reducer;
