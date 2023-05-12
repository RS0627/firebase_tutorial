import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import db from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  onSnapshot,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import TodoList from "./components/TodoList";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [posts, setPosts] = useState([]);
  const [todos, settodos] = useState([
    { id: 1, name: "todo13", completed: false },
  ]);

  useEffect(() => {
    const postData = collection(db, "posts");
    const queryRef = query(postData, orderBy("timestamp"));

    getDocs(queryRef).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      setPosts(data);
    });

    onSnapshot(queryRef, (posts) => {
      setPosts(posts.docs.map((doc) => ({ ...doc.data() })));
    });
  }, []);

  const todoRef = useRef();
  const handleAddTask = useCallback((e) => {
    const addTask = todoRef.current.value;
    settodos((prevtodos) => [
      ...prevtodos,
      { id: uuidv4(), name: addTask, completed: false },
    ]);
    todoRef.current.value = null;
  }, []);
  const toggleTodo = (id) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    settodos(newTodos);
  };

  const titleRef = useRef();
  const textRef = useRef();
  const handleClick = useCallback(
    (e) => {
      if (
        titleRef.current.value.length === 0 ||
        textRef.current.value.length === 0
      ) {
        alert("titleおよびtextに何か入力して下さい");
      } else {
        try {
          // Timestampを作成
          let timestamp = Timestamp.fromMillis(Date.now());
          // console.log(timestamp.toDate());
          addDoc(collection(db, "posts"), {
            title: titleRef.current.value,
            text: textRef.current.value,
            timestamp: timestamp,
          }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    },
    [titleRef, textRef]
  );

  return (
    <div className="App">
      <div>
        <div>
          {posts.map((post) => (
            <div key={post.title}>
              <h1>{post.title}</h1>
              <p>{post.text}</p>
            </div>
          ))}
        </div>
        <button onClick={handleClick}>記録</button>
        <div>
          <input type="text" ref={todoRef} />
        </div>

        <div>
          <label>
            title
            <input type="text" ref={titleRef}></input>
          </label>
          <label>
            text
            <input type="text" ref={textRef}></input>
          </label>
        </div>
        <button onClick={handleAddTask}>タスクの追加</button>
        <button onClick={handleAddTask}>タスクの削除</button>
        <TodoList todos={todos} toggleTodo={toggleTodo} />
      </div>
    </div>
  );
}

export default App;
