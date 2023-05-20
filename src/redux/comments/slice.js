import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const postComments = createAsyncThunk(
  "comments/postComments",
  async (obj) => {
    const { data } = await axios.post("/comments", obj);
    return data;
  }
);

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");
    return data;
  }
);

const initialState = {
  items: [],
  loadingStatus: "loading",
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    removeComment(state, action) {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchPosts:
      .addCase(fetchComments.pending, (state) => {
        state.items = [];
        state.loadingStatus = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loadingStatus = "idle";
      })
      .addCase(fetchComments.rejected, (state) => {
        state.items = [];
        state.loadingStatus = "error";
      })

      //postComment:
      .addCase(postComments.pending, (state) => {})
      .addCase(postComments.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(postComments.rejected, (state) => {})
      .addDefaultCase(() => {});
  },
});

export const commentsSelector = (state) => state.comments;

export const { reducer, actions } = commentsSlice;
export const { removeComment } = actions;
export default reducer;
