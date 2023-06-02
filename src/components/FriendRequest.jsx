import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { arrayUnion, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { Button } from "@mui/material";

const FriendRequest = ({
  requestId,
  senderId,
  receiverId,
  senderDisplayName,
  onFriendRequestProcessed,
}) => {
  const { currentUser } = useContext(AuthContext);
  const { data, setUnreadFriendRequests, setUnreadNotifications } =
    useContext(ChatContext);

  const acceptFriendRequest = async () => {
    await updateDoc(doc(db, "users", senderId), {
      friends: {
        [receiverId]: true,
      },
    });

    await updateDoc(doc(db, "users", receiverId), {
      friends: {
        [senderId]: true,
      },
    });

    await deleteDoc(doc(db, "friendRequests", requestId));

    const messageText = "accepted";

    const message = {
      senderId: currentUser.uid,
      text: messageText,
      date: Timestamp(), // Format the date here
    };

    console.log("New message:", message); // Log new message data

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(message),
    });

    console.log("Message sent successfully!");

    onFriendRequestProcessed(requestId, messageText);

    setUnreadFriendRequests((prevState) =>
      prevState.filter((request) => request.id !== requestId)
    );

    setUnreadNotifications((prevState) =>
      prevState.filter((notification) => notification.id !== requestId)
    );
  };

  const rejectFriendRequest = async () => {
    await deleteDoc(doc(db, "friendRequests", requestId));

    const messageText = "rejected";

    const message = {
      senderId: currentUser.uid,
      text: messageText,
      date: Timestamp(), // Format the date here
    };

    console.log("New message:", message); // Log new message data

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(message),
    });

    console.log("Message sent successfully!");

    onFriendRequestProcessed(requestId, messageText);

    setUnreadFriendRequests((prevState) =>
      prevState.filter((request) => request.id !== requestId)
    );

    setUnreadNotifications((prevState) =>
      prevState.filter((notification) => notification.id !== requestId)
    );
  };

  return (
    <div className="friendRequest">
      <span>{senderDisplayName} sent you a friend request</span>
      <Button variant="contained" onClick={acceptFriendRequest}>
        Accept
      </Button>
      <Button variant="contained" onClick={rejectFriendRequest}>
        Reject
      </Button>
    </div>
  );
};

export default FriendRequest;


