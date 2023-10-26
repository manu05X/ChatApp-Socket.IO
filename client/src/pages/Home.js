import React from 'react'
import Typography from '@mui/material/Typography';
import { useOutletContext } from 'react-router-dom';

export default function Home() {
    const { socket } = useOutletContext();
    console.log(socket);
  return (
    <Typography>Welcome to my Chat App</Typography>
  )
}
