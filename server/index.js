/*import express from "express";
import http from 'http';
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";


const app = express();
const PORT = 4000;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve socket.io.js from the node_modules folder
//app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));


app.get("/", (req, res) => {
    //res.json({data: "Hello World from server"});
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket)=>{
    console.log("Connection is ready");
});

app.listen(PORT, ()=>{
    console.log("Server is running at http://localhost:4000");
});
*/

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

//connect part user first connect then dissconnect
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

    //disconnect Part
    socket.on("disconnect", (socket) => {
        console.log("User left the chat");
    });

});


httpServer.listen(PORT, () => {
    console.log("Server is running at http://localhost:4000");
});
