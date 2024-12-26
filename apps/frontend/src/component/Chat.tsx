import { useEffect, useState } from "react"
import Text from "./Text";

interface messageType {
  sender:string;
  message:string
}

const Chat = ({name,socket,room}:{name:string,socket:WebSocket,room:string}) => {
    const [text,setText] = useState<string>("");
    const [messages,setMessages] = useState<messageType[]>();

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
          if(prev) return [...prev,{sender:name,message:text}]
          else return [{sender:name,message:text}]
      })
      setText("");
  }

  useEffect(()=>{
    if(socket.readyState === WebSocket.OPEN){
        const messageData = {
            type:"joinmessage",
            payload:{
                room
            }
        }
        socket.send(JSON.stringify(messageData));
    }
    const messageEvent =  (event: { data: string; })=>{
        const parsedData = JSON.parse(event.data);
        if(parsedData && parsedData.type === "message"){
            const {sender,message} = parsedData.payload;
            setMessages((prev)=>{
                if( prev ) return [...prev,{sender,message}]
                else return [{sender,message}]
            })
        }
    }
    if(socket.readyState === WebSocket.OPEN){
      socket.addEventListener('message',messageEvent);
    }else{
      console.log("Socket not ready");
    }

    return () => {
      socket.removeEventListener("message",messageEvent);
    }
},[socket])

    // useEffect(() => {
    //   console.log('Socket state:', socket.readyState); 
    //   const handleMessage = (event: { data: string; }) => {
    //       console.log("Inside the onmessage");
  //         const parsedData = JSON.parse(event.data);
  //         console.log("hello");
  //         if (parsedData.type === "message") {
  //             const { sender, message } = parsedData.payload;
  //             if (sender && message) {
  //                 setMessages((prev) => [...prev, { sender, message }]);
  //             }
  //         }
  //     };
  
      
  //         if(socket.readyState === WebSocket.OPEN){
  //           console.log('Setting up message listener...');
  //             socket.addEventListener("message",handleMessage);
  //         }else{
  //             console.log("socket is not ready");
  //         }
      
  
  //     // Cleanup function to prevent duplicate listeners
  //     return () => {
  //         if (socket) {
  //             socket.removeEventListener('message',handleMessage);
  //         }
  //     };
  // },[]);


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
