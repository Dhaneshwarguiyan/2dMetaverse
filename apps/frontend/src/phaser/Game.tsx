import { useEffect, useRef } from 'react'
import Phaser from 'phaser';
import Chat from '../component/Chat';

// import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';



const Game = ({socket,name,room}:{socket:WebSocket,name:string,room:string}) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const data = {socket:socket,name:name,room:room}
        //config object
        const config: Phaser.Types.Core.GameConfig = {
            type:Phaser.AUTO,
            width:1680,
            height:870,
            physics:{
                default:'arcade',
                arcade:{
                    gravity:{ y: 0,x:0}
                },
            },
            scale:{
                mode:Phaser.Scale.ENVELOP,
                autoCenter:Phaser.Scale.CENTER_BOTH,
            },
            scene: [
                WorldScene
            ],
            parent:gameContainerRef.current || undefined
        }

        const game = new Phaser.Game(config);
        game.scene.start('WorldScene',data);
        return ()=>{
            game.destroy(true);
        }
    },[socket,name,room])
  return (
    <div>
        <div ref={gameContainerRef} className='w-screen h-screen relative'>
        </div>
        {/* move this chat component somewhere else it is causing problem to in using spacebar */}
        <div className='absolute bottom-0'>
                <Chat name={name} socket={socket} room={room}/>
        </div>
    </div>
  )
}

export default Game
