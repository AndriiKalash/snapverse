import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { RootState } from "../store";
import { IPostsData, PostSliceState, StatusPostTags, Tags } from "./type";

export const fetchPosts = createAsyncThunk<
  IPostsData[],
  Record<string, string>
>("posts/fetchPosts", async ({ tag, sort }) => {
  const url = tag ? `/posts?tag=${tag}` : `/posts?sort=${sort}`;
  const { data } = await axios.get(url);
  return data;
});

export const fetchTags = createAsyncThunk<Tags>("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchOnePost = createAsyncThunk<IPostsData, string>(
  "posts/fetchPost",
  async (id) => {
    const { data } = await axios.get(`/posts/${id}`);
    return data;
  }
);

const initialState: PostSliceState = {
  posts: {
    items: [],
    status: StatusPostTags.LOADING,
  },
  tags: {
    items: [],
    status: StatusPostTags.LOADING,
  },
  post: {
    items: null,
    status: StatusPostTags.LOADING,
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
        state.posts.status = StatusPostTags.LOADING;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = StatusPostTags.IDLE;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = StatusPostTags.ERROR;
      })

      // fetchTags :
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = StatusPostTags.LOADING;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = StatusPostTags.IDLE;
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = StatusPostTags.ERROR;
      })

      // fetchOnePost
      .addCase(fetchOnePost.pending, (state) => {
        state.post.items = null;
        state.post.status = StatusPostTags.LOADING;
      })
      .addCase(fetchOnePost.fulfilled, (state, action) => {
        state.post.items = action.payload;
        state.post.status = StatusPostTags.IDLE;
      })
      .addCase(fetchOnePost.rejected, (state) => {
        state.post.items = null;
        state.post.status = StatusPostTags.ERROR;
      })
      .addDefaultCase(() => {});
  },
});

export const postsSelector = (state: RootState) => state.posts;

export const { reducer, actions } = postsSlice;
export const { removePost } = actions;
export default reducer;
