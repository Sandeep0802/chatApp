import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app=express();


const server=http.createServer(app);

const io=new Server (server,{
         cors:{
            origin:"http://localhost:5173",
            methods:["GET","PUT"], 
         }
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

app.use(cors());

server.listen(1000,()=>{
 console.log("running on 1000");
})