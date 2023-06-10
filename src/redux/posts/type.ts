import { IUserData } from "../auth/type";

export type Tags = string[];

export interface IPostsData {
  _id: string;
  title: string;
  text: string;
  tags: Tags;
  viewsCount: number;
  user: IUserData;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum StatusPostTags {
  LOADING = "loading",
  IDLE = "idle",
  ERROR = "error",
}

export interface IPosts {
  items: IPostsData[];
  status: StatusPostTags;
}
export interface ITags {
  items: Tags;
  status: StatusPostTags;
}

export interface IPost {
  items: IPostsData | null;
  status: StatusPostTags;
}

export interface PostSliceState {
  posts: IPosts;
  tags: ITags;
  post: IPost;
}
