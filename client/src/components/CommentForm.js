import React, { useState } from "react";
import { createComment } from "../services/api";
import { Form } from "semantic-ui-react";
import { socket } from "../services/socket";

const initialFormValues = {
  name: "",
  message: "",
};

const CommentForm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { name, message } = formValues;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && message) {
      let response = await createComment({ name, message });
      if (response.id) {
        setErrorMessage(null);
        setFormValues(initialFormValues);
        socket.emit("COMMENT_CREATED", formValues);
      }
    } else {
      setErrorMessage("Please fill out both fields.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
    {errorMessage && (
      <div className="ui error message">
        <div className="header">
          There were some errors with your submission
          </div>
        <ul className="list">
          <li>{errorMessage}</li>
        </ul>
      </div>
    )}
    <h1 className="text-center"> Add a Comment </h1>
    <Form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <Form.Field>
        <input
          name="name"
          placeholder="Enter Name"
          type="text"
          value={name}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </Form.Field>
      <Form.Field>
        <textarea
          name="message"
          placeholder="Enter a comment"
          type="text"
          value={message}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </Form.Field>
      <button className="basic black" type="submit">
        Post Comment
        </button>
    </Form>
    </>
  );
};

export default CommentForm;
