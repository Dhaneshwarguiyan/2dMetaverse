import { useEffect, useState } from "react"
import Game  from '../phaser/Game';


const Metaverse = () => {
    const [name,setName] = useState<string>("");
    const [socket,setSocket] = useState<WebSocket>();
    const [game,setGame] = useState<boolean>(false);

    useEffect(()=>{
        const wss = new WebSocket('ws://localhost:8080');
        setSocket(wss);
    },[game])

  return (
      <div className='w-screen h-screen flex justify-center items-center  overflow-hidden relative bg-slate-700'>
        {!game &&
            <div className="flex flex-col gap-3">
                <input type="text" name="name" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}} className="px-3 py-4 rounded-lg"/>
                <button onClick={()=>{setGame(true); localStorage.setItem("game",'true')}} className="px-3 py-4 bg-blue-600 rounded-lg">Join</button>
            </div>
        }
        {
        game && socket && <Game socket={socket} name={name}/>
        }
    </div>
  )
}

export default Metaverse
