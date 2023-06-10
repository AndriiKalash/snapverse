import { IUserData } from "../auth/type";

export interface PostCommentsArgument {
  postId: string;
  text: string;
}

export interface ICommentsData {
  _id: string;
  text: string;
  user: IUserData;
  createdAt: string;
  updatedAt: string;
  __v: number;
  postId: string;
}
export enum StatusComments {
  LOADING = "loading",
  IDLE = "idle",
  ERROR = "error",
}
export interface CommentsSliceState {
  itemsComment: ICommentsData[];
  loadingStatus: StatusComments;
}
