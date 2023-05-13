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

  useEffect(() => {
    const postData = collection(db, "posts");
    const queryRef = query(postData, orderBy("timestamp"));

    getDocs(queryRef).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        completed: false,
      }));
      setPosts(data);
    });

    onSnapshot(queryRef, (posts) => {
      setPosts(posts.docs.map((doc) => ({ ...doc.data(), completed: false })));
    });
  }, []);

  const taskRef = useRef();
  const handleAddTask = useCallback(
    (e) => {
      const addTask = taskRef.current.value;

      if (addTask.length === 0) {
        alert("タスクに何か入力して下さい");
        return;
      } else {
        try {
          // Timestampを作成
          let timestamp = Timestamp.fromMillis(Date.now());
          addDoc(collection(db, "posts"), {
            id: uuidv4(),
            task: addTask,
            timestamp: timestamp,
          }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      taskRef.current.value = null;
    },
    [taskRef]
  );
  const toggleTodo = (id) => {
    const newPosts = [...posts];
    const post = newPosts.find((post) => post.id === id);
    post.completed = !post.completed;
    setPosts(newPosts);
  };

  return (
    <div className="App">
      <div>
        <TodoList posts={posts} toggleTodo={toggleTodo} />
        <div>
          <label>
            追加タスク：
            <input type="text" ref={taskRef}></input>
          </label>
        </div>
        <button onClick={handleAddTask}>タスクの追加</button>
        <button onClick={handleAddTask}>タスクの削除</button>
      </div>
    </div>
  );
}

export default App;
