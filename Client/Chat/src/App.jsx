import React from "react";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import music from "../mixkit-tile-game-reveal-960.wav"
const socket = io.connect("http://localhost:1000");

const App = () => {
  let [username, setUsername] = useState("");
  let [room, setRoom] = useState("");
  let [showchat, setShowChat] = useState(false);

  const notification=new Audio(music);

  let joinRoom = () => {
    if (username != "" && room != "") {
      socket.emit("join_room", room); //ye backend route ko send krega
      setShowChat(true);
      notification.play();
    }
  };

  return (
    <>
     {!showchat && (
  <div className="join_room">
    <div className="join_room_form">
      <h1>🚀 Join a Chat Room</h1>
      <input
        type="text"
        placeholder="Enter your username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room name"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Enter Room</button>
    </div>
  </div>
)}

{showchat && (
  <Chat socket={socket} username={username} room={room} />
)}

    </>
  );
};

export default App;
