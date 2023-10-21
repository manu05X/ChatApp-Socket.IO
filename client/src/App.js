import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  //const socket = io("http://localhost:4000");
  const [message, setMessage] = useState();
  /*collect what ever we are sending from one windo to othwr and show it in UI*/
  //ir is an arry of empty string
  const [chat, setChat] = useState([]);

  // useEffect(()=>{
  //   setSocket(io("http://localhost:4000"));
  // }, []);

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
      setChat([...chat, data.message]);
    });
  }, [socket]);

  function handleForm(e){ 
    e.preventDefault();
    //console.log(message);

    /*1> sending event from frontend to backend
    {message} is the obj data that is sent
    */
    socket.emit('send-message', {message});
    setMessage("");
  }

  return (
    <div>
    <Container>
      <Box sx={{marginBottom:5}}>
      {
        chat.map((message)=>(
          <Typography key={message}>{message}</Typography>
        ))
      }
      </Box>
      
      <Box component="form" onSubmit={handleForm}>
        <TextField 
          size="small"
          label="Write your message" 
          variant="standard" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="text" type="submit">Submit</Button>
        </Box>
    </Container>
    </div>
  );
}

export default App;
