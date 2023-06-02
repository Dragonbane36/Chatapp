import { doc, getDoc,updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../Context/ChatContext";
import { VideoCall, PersonAdd } from "@mui/icons-material";
import {db} from "../Firebase";
import { AuthContext } from "../Context/AuthContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const updateUserStatus = async (status) => {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { status });
    };

    const checkUserOnlineStatus = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setIsOnline(userData.status === "online");

        // If the status field is missing, update the document to add the status field
        if (!userData.hasOwnProperty("status")) {
          updateUserStatus("online");
        }
      }
    };

    const handleDisconnect = async () => {
      // Update the status to "offline" when the user is disconnected
      updateUserStatus("offline");
    };

    // Check the user's online status initially
    checkUserOnlineStatus();

    // Set up a timer to periodically check the user's online status
    const timer = setInterval(() => {
      checkUserOnlineStatus();
    }, 5000); // Check every 5 seconds

    // Clean up the timer and handle disconnect on component unmount
    return () => {
      clearInterval(timer);
      handleDisconnect();
    };
  }, [currentUser]);

  const openMenu = () => {
    const menu = document.querySelector(".homeContainer .container .sidebar");
    const back = document.querySelector(
      ".homeContainer .container .chat .darkboi"
    );
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
      back.classList.remove("open");
    } else {
      menu.classList.add("open");
      back.classList.add("open");
    }
  };
  console.log("online",isOnline)
  return (
    <div className="chat">
      <div className="chatInfo">
        <h3 onClick={openMenu}>Menu</h3>
        <span>
          {isOnline && <div className="online-dot" />}{" "}
          {/* Render the green dot when the user is online */}
          <img
            className="avatar"
            src={data.user?.photoURL || ""}
            alt=""
          />
          {data.user?.displayName}
        </span>
        <div className="chatIcons">
          <div className="add">
            <VideoCall />
          </div>
          <div className="add">
            <PersonAdd />
          </div>
          <div className="add"></div>
        </div>
      </div>
      <Messages />
      <Input />
      <div className="darkboi" onClick={openMenu}></div>
    </div>
  );
};

export default Chat;
