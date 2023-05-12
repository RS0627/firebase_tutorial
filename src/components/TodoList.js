import React from "react";
import Todo from "./Todo";
const TodoList = (props) => {
  return props.todos.map((todo) => (
    <Todo todo={todo} key={todo.id} toggleTodo={props.toggleTodo} />
  ));
};

export default TodoList;
