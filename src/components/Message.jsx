import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import FriendRequest from "./FriendRequest";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isPdf = message.type === "document";
  const isImage = message.type === "image";

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{message.date.toDate().toString().slice(15, 21)}</span>
      </div>
      <div className="messageContent">
        {isPdf && (
          <div className="document-message">
            <p>This message contains a PDF file:</p>
            <embed src={message.docu} type="application/pdf" />
            <a href={message.docu} download>Download PDF</a>
          </div>
        )}
        {isImage && (
          <div className="image-message">
            <img className="image-thumbnail" src={message.img} alt="" />
            <a href={message.img} download>Download Image</a>
          </div>
        )}
        {message.type === "friendRequest" && (
          <FriendRequest requestId={message.requestId} />
        )}
        {!isPdf && !isImage && message.type !== "friendRequest" && (
          <p>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;


