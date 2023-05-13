import React, { useCallback } from "react";

const Todo = (props) => {
  const handleAddTodo = useCallback((e) => {
    props.toggleTodo(props.post.id);
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={props.post.completed}
          readOnly
          onChange={handleAddTodo}
        />
        {props.post.task}
      </label>
    </div>
  );
};

export default Todo;
