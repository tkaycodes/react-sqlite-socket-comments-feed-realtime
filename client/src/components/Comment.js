import React from "react";
import { Message } from "semantic-ui-react";
import { format } from "timeago.js";

const Comment = ({ comment }) => {
  const { name, message, created } = comment;
  let date = new Date(created);
  let localDate = date.toString();

  return (
    <Message>
      <Message.Header test-id="name">{name}</Message.Header>
      <p test-id="message">{message}</p>
      <p>
        <i className="clock icon" />
        {format(localDate)}
      </p>
    </Message>
  );
};

export default Comment;
