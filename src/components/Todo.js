import React, { useCallback } from "react";

const Todo = (props) => {
  const handleAddTodo = useCallback((e) => {
    props.toggleTodo(props.todo.id);
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={props.todo.completed}
          readOnly
          onChange={handleAddTodo}
        />
      </label>
      {props.todo.name}
    </div>
  );
};

export default Todo;
