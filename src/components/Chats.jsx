import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../Firebase";
import FriendRequest from "./FriendRequest";

const Chats = ({ className, selectedFriendId }) => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          setChats(doc.data());
        } else {
          // Handle the case when the document does not exist
          setChats([]); // Set an empty array or a default value
        }
      });
  
      return unsub;
    };
  
    if (currentUser.uid) {
      try {
        const unsubscribe = getChats();
        return () => unsubscribe();
      } catch (error) {
        // Handle any errors that occur during the fetching of chats
        console.log("Error fetching chats:", error);
        setChats([]); // Set an empty array or a default value
      }
    }
  }, [currentUser.uid]);
  

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const openMenu = () => {
    const menu = document.querySelector(".homeContainer .container .sidebar");
    const back = document.querySelector(".homeContainer .container .chat .darkboi");
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
      back.classList.remove("open");
    } else {
      menu.classList.add("open");
      back.classList.add("open");
    }
  };

  return (
    <div className={"chats " + className}>
      {chats &&
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const userInfo = chat[1]?.userInfo || {}; // Set a default empty object if userInfo is undefined
            const lastMessage = chat[1]?.lastMessage || {}; // Set a default empty object if lastMessage is undefined

            if (lastMessage.type === "friendRequest") {
              return <FriendRequest key={chat[0]} requestId={chat[0]} />;
            }

            return (
              <div
                className={`userChat ${selectedFriendId === userInfo.uid ? 'selected' : ''}`} // Highlight the selected friend
                key={chat[0]}
                onClick={() => {
                  handleSelect(userInfo);
                  openMenu();
                }}
              >
                <img src={userInfo.photoURL || ""} alt="" />
                <div className="userChatInfo">
                  <span>{userInfo.displayName}</span>
                  <p>{lastMessage.text}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Chats;

