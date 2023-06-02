import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../Firebase";
import Message from "./Message";
import FriendRequest from "./FriendRequest";


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [friendRequest, setFriendRequest] = useState(null);
  const { data } = useContext(ChatContext);


  const handleFriendRequestProcessed = (requestId, messageText) => {
    setFriendRequest((prevState) =>
      prevState.filter((request) => request.id !== requestId)
    );
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const messagesData = doc.data().messages.map((message) => {
          if (message.type === "friendRequest") {
            return {
              ...message,
              requestId: message.id,
              senderId: message.senderId,
              receiverId: message.receiverId,
            };
          }
          return message;
        });
        console.log("Messages data:", messagesData);
        setMessages(messagesData);
      }
    });
  
    const frequest = onSnapshot(doc(db,"friendRequests",data.user.uid+data.userId),(doc)=>{
      console.log(data.user.uid+data.userId)
      if(doc.exists()){
        setFriendRequest({...doc.data(),requestId:data.user.uid+data.userId})
      }
    });
  
    return () => {
      unSub();
      frequest();
    };
  }, [data.chatId, data.userId, data.user.uid]);
  

  return (
    <div className="messages">
      {messages.map((message) => {
        return <Message message={message} key={message.id} />;
      })}
      {friendRequest ? (
        <FriendRequest
          key={friendRequest.id}
          requestId={friendRequest.requestId}
          senderId={friendRequest.senderId}
          receiverId={friendRequest.receiverId}
          senderDisplayName={friendRequest.senderDisplayName}
          onFriendRequestProcessed={handleFriendRequestProcessed}
        />
      ) : null}
    </div>
  );
};

export default Messages;
