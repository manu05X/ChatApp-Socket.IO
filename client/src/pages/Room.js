import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useOutletContext } from 'react-router-dom';

export default function Room() {
    const params = useParams();
    //const socket = io();
    const { socket } = useOutletContext();
  
    useEffect(()=>{
        socket.emit("join-room",{roomId: params.roomId});
    }, [socket]);

    return (
    <div>Room</div>
  )
}
