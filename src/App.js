import { useCallback, useEffect, useState } from "react";
import "./App.css";
import db from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  onSnapshot,
  doc,
} from "firebase/firestore";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const postData = collection(db, "posts");
    getDocs(postData).then((snapShot) => {
      // console.log(snapShot.docs.map((doc) => ({ ...doc.data() })));
      setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });

    onSnapshot(postData, (posts) => {
      setPosts(posts.docs.map((doc) => ({ ...doc.data() })));
    });
  }, []);

  const handleTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);
  const handleText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (title.length === 0 || text.length === 0) {
        alert("titleおよびtextに何か入力して下さい");
      } else {
        try {
          // Timestampを作成
          let timestamp = Timestamp.fromMillis(Date.now());
          // console.log(timestamp.toDate());
          addDoc(collection(db, "posts"), {
            title: title,
            text: text,
            timestamp: timestamp,
          }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    },
    [title, text]
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
        <label>title</label>
        <input type="text" onChange={handleTitle}></input>
        <label>text</label>
        <input type="text" onChange={handleText}></input>
        <button onClick={handleClick}>記録</button>
      </div>
    </div>
  );
}

export default App;
