import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"

dotenv.config();
const app=express();
app.use(cors());

const server=http.createServer(app);

const io=new Server (server,{
         cors: {
    origin: ["http://localhost:5173", "https://chat-app-8v8k.vercel.app"],
    methods: ["GET", "POST"],
  },
}) 

io.on("connection",(socket)=>{
       console.log("connected succesfully",socket.id);

       socket.on("join_room",(data)=>{                                  //ye ek route h jo fornted se hit hoga 
                 socket.join(data);
                 console.log(`User Id ${socket.id} Room Id ${data}`);
       })

       socket.on("send_message",(data)=>{
           console.log(data);
           socket.to(data.room).emit("receive_message",data); 
       })

       socket.on("disconnect",()=>{ 
        console.log("disconnect successfully",socket.id);
       })
})



const PORT = process.env.PORT || 2000;
server.listen(PORT,()=>{
 console.log(`🚀 Server running on port ${PORT}`);
})