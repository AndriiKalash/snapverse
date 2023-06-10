import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import { removePost } from '../../redux/posts/slice';
import { UserInfo } from '../UserInfo';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import styles from './Post.module.scss';
import { IPostsData } from '../../redux/posts/type';
import { useAppDispatch } from '../../hooks';

interface PostProps extends IPostsData {
  commentsCount: number;
  children?: ReactNode;
  isFullPost?: boolean;
  isEditable?: boolean;
}

export const Post: React.FC<PostProps>  = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isEditable,
}) => {
   
  const dispatch = useAppDispatch();
  
  const onClickRemove = () => {
       try {
        dispatch(removePost(_id));
        axios.delete(`/posts/${_id}`);
       } catch (error) {
        console.warn(error);
        alert('can not delete the post');
       }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo 
        fullName = {user.fullName}
        avatarUrl = {user.avatarUrl}
        additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag}>
                <Link to={`/tags/${tag}`}>#{tag}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              {
              isFullPost ?
              <CommentIcon /> :
              <Link 
                style={{color:"rgba(0, 0, 0, 0.87)"}} 
                to={`/posts/${_id}`}>
                <CommentIcon />
              </Link>
              }
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
