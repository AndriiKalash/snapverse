import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { PostSkeleton } from '../components/Post/Skeleton';

import { fetchPosts, fetchTags, postsSelector } from '../redux/posts/slice';
import { selectorAuthUser } from '../redux/auth/slice';
import { commentsSelector, fetchComments } from '../redux/comments/slice';
import {  ListItemAvatar } from '@mui/material';




export const Home = () => {

  const dispatch = useDispatch();
  const {posts, tags} = useSelector(postsSelector);
  const {user, statusUser} = useSelector(selectorAuthUser);
  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const [sort , setSort] = useState("createdAt");
  const {items, loadingStatus} = useSelector(commentsSelector);
  
 
  useEffect(()=>{
    dispatch(fetchPosts({ sort }));
  },[sort]);
  
  useEffect(()=>{
    dispatch(fetchTags());
    dispatch(fetchComments());
  },[]);

  const setEditable = (id) => {
    if (user) {
      return id === user._id;
    }
  };

  
  return (
    <>
      <Tabs style={{ marginBottom: 15 }}
       value={sort==="createdAt"?0:1} 
       aria-label="basic tabs example">
        <Tab
        onClick={()=>setSort("createdAt")}
        label="New" />
        <Tab 
        onClick={()=>setSort("viewsCount")} 
        label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {
            isPostLoading ? [...Array(5)].map((_,i) => (
              <PostSkeleton  key={i}/> )
              ):( 
                posts.items.length === 0 ?
                 <h3> No one post for today </h3> :
                 posts.items.map((post) => {
                    const filteredComments = items.filter(
                    (comment) => comment.postId === post._id);
                    const commentsCount = filteredComments.length;
                  return (
                    <Post 
                    key={post._id}
                    {...post}
                    commentsCount={commentsCount}
                    isEditable={setEditable(post.user._id)}
                  />
                  )
                })
              )
          }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock 
          items={tags.items} 
          isLoading={isTagsLoading} />
          <CommentsBlock
          items={
            items.length>3?
            items.slice(-3):items
          }
          isLoading={loadingStatus}
          />
        </Grid>
      </Grid>
    </>
  );
};
