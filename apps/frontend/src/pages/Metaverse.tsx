import { useEffect, useState } from "react"
import Game  from '../phaser/Game';
import Chat from '../component/Chat';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../slices/userslice";

const Metaverse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [socket,setSocket] = useState<WebSocket>();


    useEffect(()=>{
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if(token === "" || !token){
          navigate('/login');
        }else{
          dispatch(loginUser({token,username}))
          navigate('/home');
        }
        const wss = new WebSocket('ws://localhost:8080');
        wss.onopen = ()=>{
            console.log("socket is opened");
            setSocket(wss);
        }
    },[])

  return (
      <div className='w-screen h-screen flex justify-center items-center relative bg-slate-700'>
        {
         socket &&         
        <div>
            <Game socket={socket} room={"aa"}/> 
            <div className='absolute bottom-0'>
                <Chat socket={socket} room={"aa"}/>
            </div>
        </div>
        }
    </div>
  )
}

export default Metaverse


