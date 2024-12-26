import { useEffect, useState } from "react"
import Text from "./Text";

interface messageType {
  sender:string;
  message:string
}

const Chat = ({name,socket,room}:{name:string,socket:WebSocket,room:string}) => {
    const [text,setText] = useState<string>("");
    const [messages,setMessages] = useState<messageType[]>([{sender:name,message:"Hello"}]);


    const handleMessage = ()=>{
        if(socket.readyState === WebSocket.OPEN){
            const messageData = {
                type:"message",
                payload:{
                    sender:name,
                    message:text,
                    room:room
                }
            }
            socket.send(JSON.stringify(messageData))
        }
        setMessages((prev)=>{
            return [...prev,{sender:name,message:text}]
        })
    }

    useEffect(()=>{
        if(socket.readyState === WebSocket.OPEN){
            const messageData = {
                type:"join",
                payload:{
                    room
                }
            }
            socket.send(JSON.stringify(messageData));
        }
        socket.onmessage = (event)=>{
            const parsedData = JSON.parse(event.data);
            console.log(parsedData.payload)
            console.log(JSON.parse(JSON.stringify(event.data)));
            if(parsedData && parsedData.type === "message"){
                const {sender,message} = parsedData.payload;
                setMessages((prev)=>{
                    return [...prev,{sender,message}]
                })
            }
        }
    },[socket])

  return (
    <div className="backdrop-blur-sm hover:duration-500 w-[400px] h-[600px] p-4 m-2 flex flex-col justify-end gap-4">
        <div className="">
            {
              messages && messages.map((data,key)=>{
                return <Text text={data.message} sender={data.sender} key={key}/>
              })
            }
        </div>
        <div className="w-full flex gap-3">
            <input type="text" placeholder="message" value={text} onChange={(e)=>{setText(e.target.value)}} className="px-3 py-2 rounded-lg"/>
            <button className="bg-blue-500 px-3 py-2 rounded-lg" onClick={handleMessage}>Send</button>
        </div>
    </div>
  )
}

export default Chat
