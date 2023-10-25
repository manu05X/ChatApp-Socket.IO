//rfc shorcut for templet
import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function ChatWindow() {
    const [socket, setSocket] = useState(null);
    //const socket = io("http://localhost:4000");
    const [message, setMessage] = useState("");
    /*collect what ever we are sending from one windo to othwr and show it in UI*/
    //ir is an arry of empty string
    const [chat, setChat] = useState([]);
    //Typing event
    const [typing, setTyping] = useState(false);

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
          // then set received true or false
          setChat((prev) => [...prev, {message: data.message, received: true}]);
        });

        //4> typing-started-from-server from server recieved
        socket.on("typing-started-from-server", () => 
            //console.log("typing.....");
            setTyping(true)
          );

          //4> typing-stoped-from-server from server recieved
          socket.on("typing-stoped-from-server", () =>
            //console.log("typing.....");
            setTyping(false)
          );

      }, [socket]);

      //handling message event
      function handleForm(e){ 
        e.preventDefault();
        //console.log(message);
    
        /*1> sending event from frontend to backend
        {message} is the obj data that is sent
        */
        socket.emit('send-message', {message});
        // then set received false as we are sending it
        setChat((prev) => [...prev, {message, received: false}]);
        setMessage("");
      }

      const [typingTimeout, settypingTimeout] = useState(null);

      //Typing event is triggered that need to be handled 
      function handleInput(e){
        setMessage(e.target.value);
        //1> sending event from frontend to backend
        socket.emit("typing-started");

        if(typingTimeout) clearTimeout(typingTimeout);

        settypingTimeout(
            setTimeout(()=>{
                //1
                socket.emit("typing-stoped");
            },1000)
        );
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
            {typing && (
                <InputLabel sx={{color:"white"}} shrink htmlFor="message-input">
                    Typing...
                </InputLabel>
            )}
            
                <OutlinedInput
                sx={{backgroundColor:"white", width:"100%"}}
                placeholder="Write your message"
                size="small"
                fullWidth
                id="message-input"
                value={message}
                onChange={handleInput}
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
