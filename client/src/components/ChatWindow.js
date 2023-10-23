//rfc shorcut for templet
import React from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { grey } from '@mui/material/colors';

export default function ChatWindow() {
    const [socket, setSocket] = useState(null);
    //const socket = io("http://localhost:4000");
    const [message, setMessage] = useState("");
    /*collect what ever we are sending from one windo to othwr and show it in UI*/
    //ir is an arry of empty string
    const [chat, setChat] = useState([]);

    useEffect(()=>{
        setSocket(io("http://localhost:4000"));
      }, []);
    
      /*
        4> Reciving "message-from-server" event from backend/server and its content as data
        here we are handling it
        */
      useEffect(()=>{
        if(!socket) 
          return;
    
        socket.on("message-from-server", (data) => {
          //console.log("Message Recieved", data);
          //now set the chat
          setChat((prev) => [...prev, {message: data.message, received: true}]);
        });
      }, [socket]);
    
      function handleForm(e){ 
        e.preventDefault();
        //console.log(message);
    
        /*1> sending event from frontend to backend
        {message} is the obj data that is sent
        */
        socket.emit('send-message', {message});
        setChat((prev) => [...prev, {message, received: false}]);
        setMessage("");
      }

  return (
    <Box sx={{display:'flex', justifyContent:"center"}}>
        <Card 
        sx={{ 
            padding:2, 
            marginTop:10, 
            width:"60%",
            backgroundColor:"grey"
            }}>
            <Box sx={{ marginBottom:5 }}>
            {
                chat.map((data)=>(
                <Typography 
                sx={{textAlign: data.received ? "left" : "right"}} 
                key={data.message}>
                    {data.message}
                </Typography>
                ))
            }
            </Box>
        
            <Box component="form" onSubmit={handleForm}>
                <OutlinedInput
                sx={{backgroundColor:"white", width:"100%"}}
                placeholder="Write your message"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton type="submit" edge="end">
                        <SendIcon/>
                    </IconButton>
                    </InputAdornment>
                }
                />

            </Box>
        </Card>
    </Box>
  )
}
