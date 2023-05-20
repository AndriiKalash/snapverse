import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { selectorAuthUser } from "../../redux/auth/slice";
import { postComments } from "../../redux/comments/slice";
import { Skeleton } from "@mui/material";
import styles from "./AddComment.module.scss";


export const Index = ({postId}) => {

  const [text, setText] = useState('');
  const {user, statusUser, isAuth} = useSelector(selectorAuthUser);
  const dispatch = useDispatch();
  
  
  const handleSubmit = () => {
    try {
      const commentValue = {
        postId,
        text,
      };
      dispatch(postComments(commentValue))
    } catch (error) {
      console.warn(error);
      alert('upload comment failed');
    }finally{
      setText('');
    }
  }


  return (
    isAuth &&
    <> 
      <div className={styles.root}>
        {
          statusUser==="loading"?
          <Skeleton variant="circular" width={40} height={40} /> :
          <Avatar
          classes={{ root: styles.avatar }}
          src={ user.avatarUrl?user.avatarUrl : ''}
        />
        }
        
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={(e)=>setText(e.target.value)}
          />
          <Button onClick={handleSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
