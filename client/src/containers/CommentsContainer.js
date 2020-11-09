import React, { useState, useEffect } from "react";
import { fetchComments } from "../services/api";
import CommentForm from "../components/CommentForm";
import Comment from "../components/Comment";
import { socket } from "../services/socket";

const CommentsContainer = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadInitialComments = async () => {
      const results = await fetchComments();
      setComments(results);
    };
    loadInitialComments();
  }, []);

  useEffect(() => {
    socket.on("COMMENT_CREATED", (newComment) => {
      setComments((staleComments) => [...staleComments, newComment]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
    <div
      className="ui padded text container segment"
      style={{ border: 0, boxShadow: "none" }}
    >
      <CommentForm />
      <h1 className="text-center">Latest Comments</h1>
      <div>
        {comments
          .map((comment, index) => <Comment comment={comment} key={index} />)
          .reverse()}
      </div>
    </div>
    </>
  );
};

export default CommentsContainer;
