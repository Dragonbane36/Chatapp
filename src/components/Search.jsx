// Search.js
import React, { useContext, useState } from "react";
import { Button } from '@mui/material';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const sendFriendRequest = async () => {
    const senderId = currentUser.uid;
    const receiverId = user.uid;
    const requestId = senderId + receiverId;
    const senderDisplayName= currentUser.displayName;

    // Create a friend request document
    await setDoc(doc(db, "friendRequests", requestId), {
      senderId,
      receiverId,
      senderDisplayName,
      status: "pending",
      createdAt: serverTimestamp(),
      type: "friendRequest",
    });

    setUser(null);
    setUsername("");
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
  
    try {
      const userChatsRef = doc(db, "userChats", currentUser.uid);
      const userChatsSnap = await getDoc(userChatsRef);
  
      if (!userChatsSnap.exists()) {
        // Create the userChats document if it doesn't exist
        await setDoc(userChatsRef, {});
      }
  
      if (!userChatsSnap.exists() || !userChatsSnap.data()[combinedId]) {
        // Create the chat document
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
  
        // Update the userChats document with the chat information
        await updateDoc(userChatsRef, {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
  
        await sendFriendRequest();
      }
    } catch (err) {
      console.error(err);
    }
  
    // Dispatch an action to update the user and chat ID in the ChatContext
    dispatch({ type: "CHANGE_USER", payload: user });
  
    setUser(null);
    setUsername("");
  };
  


  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
          <Button
            size="small"
            variant="contained"
            onClick={sendFriendRequest}
          >
            Send Friend Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default Search;
