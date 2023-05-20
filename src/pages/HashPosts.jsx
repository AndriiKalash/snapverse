import Grid from '@mui/material/Grid';
import { PostSkeleton } from '../components/Post/Skeleton';
import { Post } from '../components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, postsSelector } from '../redux/posts/slice';
import { useEffect } from 'react';


export const HashPosts = () =>{

    const {tag} = useParams();
    const dispatch = useDispatch();
    const {posts} = useSelector(postsSelector);
    const {items, status} = posts
    
  
    useEffect(()=>{
        dispatch(fetchPosts({tag}))
    },[tag]);

    return (
      <>
      <h2>#{tag}</h2>
      <Grid container spacing={2} >
          {
            status === "loading" ? [...Array(5)].map((_,i) => (
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

 