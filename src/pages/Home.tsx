import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks';

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
import { StatusPostTags } from '../redux/posts/type';






export const Home: React.FC = () => {

  const dispatch = useAppDispatch();
  const {posts, tags} = useSelector(postsSelector);
  const {user} = useSelector(selectorAuthUser);
  const isPostLoading = posts.status === StatusPostTags.LOADING;
  const isTagsLoading = tags.status === StatusPostTags.LOADING;
  const [sort , setSort] = useState("createdAt");
  const {itemsComment, loadingStatus} = useSelector(commentsSelector);
  
 
  useEffect(()=>{
    dispatch(fetchPosts({ sort }));
  },[sort]);
  
  useEffect(()=>{
    dispatch(fetchTags());
    dispatch(fetchComments());
  },[]);

  const setEditable = (id: string): boolean => {
      return user && id === user._id ? true : false;
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
                    const filteredComments = itemsComment.filter(
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
            itemsComment.length>3?
            itemsComment.slice(-3):
            itemsComment
          }
          isLoading={loadingStatus}
          />
        </Grid>
      </Grid>
    </>
  );
};
