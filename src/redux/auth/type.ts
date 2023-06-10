export interface IUserArgument {
  fullName: string;
  email: string;
  avatarUrl?: string;
  password: string;
}

export interface IUserData extends IUserArgument {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
}
export enum StatusUser {
  LOADING = "loading",
  IDLE = "idle",
  ERROR = "error",
}
export interface AuthSliceState {
  user: IUserData | null;
  statusUser: StatusUser;
  isAuth: boolean;
}
