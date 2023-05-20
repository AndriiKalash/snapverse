import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch, useSelector } from "react-redux";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { PostSkeleton } from "../components/Post/Skeleton";
import { commentsSelector, fetchComments } from "../redux/comments/slice";


export const FullPost = () => {

  const {id} = useParams();
  const [fullPost, setFullPost] = useState({});
  const [status, setStatus] = useState('loading');
  const dispatch = useDispatch();  
  const {items, loadingStatus} = useSelector(commentsSelector);
  const filteredComments = items.filter((comment) => comment.postId === id);
  
  const getOnePost = async() =>{
     setStatus('loading');
    try {
      const {data} = await(axios.get(`/posts/${id}`));
      setFullPost(data);
      setStatus('idle');
    } catch (error) {
      setStatus("error");
      throw new Error(error);
    }
  };

  useEffect(()=>{
   getOnePost();
   dispatch(fetchComments());
  },[]);

  if (status === "error") {
    return <div>Post not found.</div>
  }


  return (
    <>
    {
      status==="loading" ? (
        <PostSkeleton/>
      ) : (
        <Post
        title={fullPost.title}
        imageUrl={fullPost.imageUrl}
        user={fullPost.user}
        createdAt={fullPost.createdAt}
        viewsCount={fullPost.viewsCount}
        commentsCount={filteredComments.length}
        tags={fullPost.tags}
        isFullPost
      >
        <ReactMarkdown children={fullPost.text}/>
      </Post>
      )
    }
      
      <CommentsBlock
        items={filteredComments}
        isLoading={loadingStatus}
      >
        <Index postId={id} />
      </CommentsBlock>
    </>
  );
};
