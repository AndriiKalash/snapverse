import React, { ReactNode } from "react";
import { selectorAuthUser } from "../redux/auth/slice";
import { useSelector } from "react-redux";
import axios from "../axios";
import { removeComment } from "../redux/comments/slice";
import { SideBlock } from "./SideBlock";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Clear';
import { ICommentsData, StatusComments } from "../redux/comments/type";
import { useAppDispatch } from "../hooks";


interface CommentsBlockProps  {
  items : ICommentsData[];
  children?: ReactNode;
  isLoading: StatusComments;
}

export const CommentsBlock: React.FC<CommentsBlockProps> = ({ items, children, isLoading }) => {

  const dispatch = useAppDispatch();
  const {user} = useSelector(selectorAuthUser);

  const setEditable = (id: string): boolean =>{
     return user && id === user._id ? true : false;
  }
 
  const onClickRemove = (id: string) => {
    try {
      dispatch(removeComment(id));
      axios.delete(`/comments/${id}`);
    } catch (error) {
      console.warn(error);
      alert('can not delete the comment');
    }
  }

  if (isLoading===StatusComments.ERROR) {
    return <div>Could not upload comments </div>
  }
  
  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading===StatusComments.LOADING ? 
        [...Array(5)] :
         items).map((obj: ICommentsData, index) => {
          return (
            <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading===StatusComments.LOADING ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading===StatusComments.LOADING ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
              {
                isLoading===StatusComments.IDLE && 
                setEditable(obj.user._id) &&
                <IconButton onClick={()=>onClickRemove(obj._id)} color="secondary">
                  <DeleteIcon style={{color:"rgba(0, 0, 0, 0.27)"}} />
                </IconButton>
              }
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
          )
        } )}
      </List>
      {children}
    </SideBlock>
  );
};
