import express from "express";
import http from 'http';
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin:["http://localhost:3000"],
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the socket.io.js file as a static asset
//app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

app.get("/", (req, res) => {
    //res.json({data: "Hello World from server"});
    res.sendFile(__dirname + "/index.html");
});

//connect part, user first connect then dissconnect
io.on("connection", (socket) => {
    //console.log("Connection is ready");
    /*
    2> Reciving "send-message" event from frontend/client and its content as data
    here we are handling it
    * socket.on -> it listen a event
    */
    socket.on("send-message", (data)=>{  
        //console.log("Message Recived", data);
        /*
            3> sending "send-message" event from backend/server and its content as data
            // brodcast help To connected all clients except the sender 
        */
       socket.broadcast.emit("message-from-server", data);
    });
    //2> typing-started event recived from frontend
    socket.on("typing-started", (data)=>{  
        //console.log("someting typing");
        //3> sending brodcast to other user from server to frontend
       socket.broadcast.emit("typing-started-from-server");
    });

    //2> typing stoped
    socket.on("typing-stoped", (data)=>{
        //3> sending brodcast to other user from server to frontend
       socket.broadcast.emit("typing-stoped-from-server");
    });

    //disconnect Part
    socket.on("disconnect", (socket) => {
        console.log("User left the chat");
    });

});


httpServer.listen(PORT, () => {
    console.log("Server is running at http://localhost:4000");
});
