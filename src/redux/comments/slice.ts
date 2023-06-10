import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../axios";
import { RootState } from "../store";
import {
  CommentsSliceState,
  ICommentsData,
  PostCommentsArgument,
  StatusComments,
} from "./type";

export const postComments = createAsyncThunk<
  ICommentsData,
  PostCommentsArgument
>("comments/postComments", async (obj) => {
  const { data } = await axios.post("/comments", obj);
  return data;
});

export const fetchComments = createAsyncThunk<ICommentsData[]>(
  "comments/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");
    return data;
  }
);

const initialState: CommentsSliceState = {
  itemsComment: [],
  loadingStatus: StatusComments.LOADING,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    removeComment(state, action: PayloadAction<string>) {
      state.itemsComment = state.itemsComment.filter(
        (item) => item._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchPosts:
      .addCase(fetchComments.pending, (state) => {
        state.itemsComment = [];
        state.loadingStatus = StatusComments.LOADING;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.itemsComment = action.payload;
        state.loadingStatus = StatusComments.IDLE;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.itemsComment = [];
        state.loadingStatus = StatusComments.ERROR;
      })

      //postComment:
      .addCase(postComments.pending, (state) => {})
      .addCase(
        postComments.fulfilled,
        (state, action: PayloadAction<ICommentsData>) => {
          state.itemsComment.push(action.payload);
        }
      )
      .addCase(postComments.rejected, (state) => {})
      .addDefaultCase(() => {});
  },
});

export const commentsSelector = (state: RootState) => state.comments;

export const { reducer, actions } = commentsSlice;
export const { removeComment } = actions;
export default reducer;
