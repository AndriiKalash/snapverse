import Grid from '@mui/material/Grid';
import { PostSkeleton } from '../components/Post/Skeleton';
import { Post } from '../components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchPosts, postsSelector } from '../redux/posts/slice';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { StatusPostTags } from '../redux/posts/type';


export const HashPosts: React.FC = () =>{

    const {tag} = useParams();
    const dispatch = useAppDispatch();
    const {items, status} = useSelector(postsSelector).posts;
    
  
    useEffect(()=>{
      if (typeof tag === "string") {
         dispatch(fetchPosts({tag}));
      }
    },[tag]);

    return (
      <>
      <h2>#{tag}</h2>
      <Grid container spacing={2} >
          {
            status === StatusPostTags.LOADING ? [...Array(5)].map((_,i) => (
              <Grid key={i} item xs={6}>
              <PostSkeleton  />
              </Grid> )
              ):(
                items.map((post) => (
                  <Grid key={post._id} item xs={6}>
                  <Post 
                  {...post}
                  commentsCount={3}
                  />
                  </Grid>
                  )
                )
              )
          }
      </Grid>
      </> 
    )
}

 