import React from "react";
import Todo from "./Todo";
const TodoList = (props) => {
  return props.posts.map((post) => (
    <Todo post={post} key={post.id} toggleTodo={props.toggleTodo} />
  ));
};

export default TodoList;
