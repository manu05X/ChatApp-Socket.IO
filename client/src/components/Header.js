import Card  from '@mui/material/Card';
import Button  from '@mui/material/Button';
import {v4 as uuidv4 } from "uuid";
import { Link } from 'react-router-dom';
import React from 'react';

export default function Header() {
    const roomId = uuidv4();
  return (
    <Card sx={{ marginTop: 10 }}>
        <Link to="/">
            <Button variant="text">Home</Button>
        </Link>
        <Link to="/chats">
            <Button variant="text">Chats</Button>
        </Link>
        <Link to={`/room/${roomId}`}>
            <Button variant="text">Room1</Button>
        </Link>
    </Card>
  );
}
