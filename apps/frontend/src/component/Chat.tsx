import { useEffect, useState } from "react"
import Text from "./Text";

interface messageType {
  sender:string;
  message:string
}

const Chat = ({name,socket}:{name:string,socket:WebSocket}) => {
    const [text,setText] = useState<string>("");
    const [messages,setMessages] = useState<messageType[]>([{sender:name,message:"Hello"}]);

    useEffect(()=>{
      socket.onmessage = (event)=>{
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        console.log("hello");
        //payload will contain message and sender name and profile information
        if(parsedData.type === "message"){
          const {sender,message} = parsedData.payload;
          if(sender && message){
            setMessages((prev)=>{
              return [...prev,{sender,message}]
            });
          }
        }
      }
    },[])

    const sendMessage = ()=>{

      socket.send(JSON.stringify({
        type:"message",
        payload:{
          sender:"me",
          message:text
        }
      }))
      
      setMessages((prev)=>{
        return [...prev,{sender:"me",message:text}]
      });
      //empty the field
      setText("");
    }

  return (
    <div className="backdrop-blur-sm hover:duration-500 w-[400px] h-[600px] p-4 m-2 flex flex-col justify-end gap-4">
        <div className="">
            {
              messages && messages.map((data)=>{
                return <Text text={data.message} sender={data.sender}/>
              })
            }
        </div>
        <div className="w-full flex gap-3">
            <input type="text" placeholder="message" value={text} onChange={(e)=>{setText(e.target.value)}} className="px-3 py-2 rounded-lg"/>
            <button className="bg-blue-500 px-3 py-2 rounded-lg" onClick={sendMessage}>Send</button>
        </div>
    </div>
  )
}

export default Chat
