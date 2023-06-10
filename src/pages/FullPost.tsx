import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useSelector } from "react-redux";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { PostSkeleton } from "../components/Post/Skeleton";
import { commentsSelector, fetchComments } from "../redux/comments/slice";
import { useAppDispatch } from "../hooks";
import { fetchOnePost, postsSelector } from "../redux/posts/slice";
import { StatusPostTags } from "../redux/posts/type";


export const FullPost: React.FC = () => {

  const {id} = useParams();
  const postId =  id ?? "";
  const dispatch = useAppDispatch();  
  const {items, status} = useSelector(postsSelector).post
  const {itemsComment, loadingStatus} = useSelector(commentsSelector);
  const filteredComments = itemsComment.filter((comment) => comment.postId === postId);

  useEffect(()=>{
    if (typeof id === "string") {
      dispatch(fetchOnePost(postId));
    }
    dispatch(fetchComments());
  },[]);

  if (status === StatusPostTags.ERROR) {
    return <div>Post not found.</div>
  }


  return (
    <>
    {
      (status === StatusPostTags.LOADING || !items) ?
      <PostSkeleton/> :
      <Post
        {...items}
        commentsCount={filteredComments.length}
        isFullPost
      >
        <ReactMarkdown children={items.text}/>
      </Post>
    }
      <CommentsBlock
        items={filteredComments}
        isLoading={loadingStatus}
      >
        <Index postId = {postId}/>
      </CommentsBlock>
    </>
  );
};
