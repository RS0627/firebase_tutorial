import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import db from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import TodoList from "./components/TodoList";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [posts, setPosts] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);

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
    setDeleteFlag(false);
  }, [deleteFlag]);

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
  const handleDeleteTask = useCallback((e) => {
    const newPosts = posts.filter((post) => post.completed);
    newPosts.map((post) => {
      const collectionRef = collection(db, "posts");
      const queryRef = query(collectionRef, where("id", "==", post.id));
      getDocs(queryRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnapshot) => {
            const docId = docSnapshot.id;
            console.log("ドキュメントID:", docId);

            const shouldDelete = window.confirm(
              "「" + post.task + "」" + "を削除しますか？"
            );
            if (shouldDelete) {
              const docRef = doc(collectionRef, docId);
              deleteDoc(docRef)
                .then(() => {
                  console.log("ドキュメントの削除に成功しました。");
                })
                .catch((err) => {
                  console.log(
                    "ドキュメントの削除中にエラーが発生しました:",
                    err
                  );
                });
            }
          });
          // 削除があったら、useEffectを呼び出す
          setDeleteFlag(true);
        })
        .catch((error) => {
          console.error("ドキュメントの取得中にエラーが発生しました:", error);
        });
    });
  });
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
        <button onClick={handleDeleteTask}>タスクの削除</button>
      </div>
    </div>
  );
}

export default App;
