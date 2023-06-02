import React, { useContext, useState } from "react";
import { EmojiEmotions, Gif, Image, AttachFile } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [docu, setDocu] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          // Handle upload error
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                  type: "image",
                }),
              });
            })
            .catch((error) => {
              // Handle download URL retrieval error
              console.log(error);
            });
        }
      );
    } else if (docu) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, docu);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          // Handle upload error
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  docu: downloadURL,
                  type: "document",
                }),
              });
            })
            .catch((error) => {
              // Handle download URL retrieval error
              console.log(error);
            });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          type: "message",
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setDocu(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <div className="send">
        <label htmlFor="document">
          <AttachFile />
          <input
            type="file"
            style={{ display: "none" }}
            id="document"
            onChange={(e) => setDocu(e.target.files[0])}
          />
        </label>

        <label htmlFor="image">
          <Image />
          <input
            type="file"
            style={{ display: "none" }}
            id="image"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </label>

        <label htmlFor="emoji">
          <EmojiEmotions />
          <input
            type="file"
            style={{ display: "none" }}
            id="emoji"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </label>

        <label htmlFor="gif">
          <Gif />
          <input
            type="file"
            style={{ display: "none" }}
            id="gif"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
