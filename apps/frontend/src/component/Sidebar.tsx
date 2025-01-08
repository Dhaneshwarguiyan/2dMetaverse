import { useNavigate } from "react-router-dom";
import Exit from "../icons/Exit";
import Message from "../icons/Message";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import axios from "axios";

interface messageType {
  // id: number;
  message: string;
  // read:boolean;
  sender: string;
}

const Sidebar = ({ socket, room }: { socket: WebSocket; room: string }) => {
  const [messageDialog, setMessageDialog] = useState<boolean>(false);
  const [messages, setMessages] = useState<messageType[]>();
  const [newMessages, setNewMessages] = useState<number>(0);

  const navigate = useNavigate();

  const getAllMessages = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/messages/room`,
        {
          room,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
    const messageEvent = (event: { data: string }) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData && parsedData.type === "message") {
        //creating notification if the tab is closed
        if (!messageDialog) {
          setNewMessages((prev) => {
            return prev + 1;
          });
        }
        const { sender, message } = parsedData.payload;
        setMessages((prev) => {
          if (prev) return [...prev, { sender, message }];
          else return [{ sender, message }];
        });
      }
    };
    if (socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", messageEvent);
    } else {
      console.log("Socket not ready");
    }

    return () => {
      socket.removeEventListener("message", messageEvent);
    };
  }, [socket]);

  return (
    <div className="h-screen absolute bottom-0 bg-white flex flex-col justify-end p-3 py-5 gap-4">
      <span
        className="rounded-full flex justify-center items-center w-[50px] h-[50px]  shadow-deep cursor-pointer text-blue-600 relative"
        onClick={() => {
          setMessageDialog(!messageDialog);
          setNewMessages(0);
        }}
      >
        <Message />
        {newMessages !== 0 && (
          <span className="text-white text-sm bg-red-500 font-extrabold  rounded-full w-[25px] h-[25px] flex justify-center items-center absolute bottom-8 left-7">
            {newMessages}
          </span>
        )}
      </span>
      <span
        className="rounded-full flex justify-center items-center w-[50px] h-[50px] shadow-deep cursor-pointer text-blue-600"
        onClick={() => {
          socket.close();
          navigate("/home");
        }}
      >
        <Exit />
      </span>
      {messageDialog && messages && (
        <span className="absolute left-[75px] bottom-0">
          <Chat
            socket={socket}
            room={room}
            messages={messages}
            setMessages={setMessages}
          />
        </span>
      )}
    </div>
  );
};

export default Sidebar;
