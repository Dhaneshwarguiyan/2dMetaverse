import { useEffect, useState } from "react"
import Game  from '../phaser/Game';
import Chat from '../component/Chat';

// import { setWebSocket } from "../utils/socket";

const Metaverse = () => {
    //here name will be replaced by the username of the user
    const [name,setName] = useState<string>("");
    const [room,setRoom] = useState<string>("");
    const [socket,setSocket] = useState<WebSocket>();
    const [game,setGame] = useState<boolean>(false);


    useEffect(()=>{
        const wss = new WebSocket('ws://localhost:8080');
        wss.onopen = ()=>{
            console.log("socket is opened");
            setSocket(wss);
        }
    },[])

  return (
      <div className='w-screen h-screen flex justify-center items-center relative bg-slate-700'>
        {!game &&
            <div className="flex flex-col gap-3">
                <input type="text" name="name" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}} className="px-3 py-4 rounded-lg"/>
                <input type="text" name="room" placeholder="Room" value={room} onChange={(e)=>{setRoom(e.target.value)}} className="px-3 py-4 rounded-lg"/>
                <button onClick={()=>{setGame(true); localStorage.setItem("game",'true')}} className="px-3 py-4 bg-blue-600 rounded-lg">Join</button>
            </div>
        }
        {
        game && socket &&         
        <div>
            <Game socket={socket} name={name} room={room}/> 
            <div className='absolute bottom-0'>
                <Chat name={name} socket={socket} room={room}/>
            </div>
        </div>
        }
    </div>
  )
}

export default Metaverse


        {/* move this chat component somewhere else it is causing problem to in using spacebar */}
