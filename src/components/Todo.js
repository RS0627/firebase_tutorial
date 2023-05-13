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
        {props.todo.text}
      </label>
    </div>
  );
};

export default Todo;
