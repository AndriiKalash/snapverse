import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ tag, sort }) => {
    const url = tag ? `/posts?tag=${tag}` : `/posts?sort=${sort}`;
    const { data } = await axios.get(url);
    return data;
  }
);

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    removePost(state, action) {
      state.posts.items = state.posts.items.filter(
        (item) => item._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchPosts:
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = "idle";
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = "error";
      })

      // fetchTags :
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = "idle";
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = "error";
      })
      .addDefaultCase(() => {});
  },
});

export const postsSelector = (state) => state.posts;

export const { reducer, actions } = postsSlice;
export const { removePost } = actions;
export default reducer;
