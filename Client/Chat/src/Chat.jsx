import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import music from "../iphone-sms-tone-original-mp4-5732.mp3"

const Chat = ({ socket, username, room }) => {
  let [currentmessage, setCurrentMessage] = useState("");
  let [messageList, setMessageList] = useState([]);
  let bottomRef = useRef(null);

   const notification=new Audio(music);

  let sendMessage = async () => {
    if (currentmessage != "") {
      let message = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentmessage,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      console.log("sending data", message);
      await socket.emit("send_message", message);
      setMessageList((prevMessage) => [...prevMessage, message]); //callback kyuki pehli ki chiz bhi chahiye
      setCurrentMessage("");
      notification.play();
    }
  };

  useEffect(() => {
    let handleReceiveMessage = (data) => {
      setMessageList((prevMessage) => [...prevMessage, data]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  //new message ayega to autoScroll
useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
  <div className="chatContainer">
    <h1>Welcome {username}</h1>

    <div className="chatBody">
      {messageList.map((msg) => {
        const isSentByMe = msg.author === username;
        return (
          <div
            className={`messageContainer ${isSentByMe ? "sent" : "received"}`}
            key={msg.id}
          >
            <div className="message">
              <p>{msg.message}</p>
            </div>
            <div className="msgDetails">
              <span>{msg.author}</span>
              <span>{msg.time}</span>
            </div>
          </div>
        );
      })}

      
      <div ref={bottomRef} />
    </div>

    <div className="composeBar">
      <input
        type="text"
        value={currentmessage}
        placeholder="Enter your message"
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);

};

export default Chat;
