import { useEffect, useState } from "react";
import Game from "../phaser/Game";
import Chat from "../component/Chat";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../slices/userslice";
import { RootState } from "../store/store";
import { mapType } from "../types/types";
import axios from "axios";

const Metaverse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const room = useSelector((state: RootState) => state.map.room);
  const token = useSelector((state: RootState) => state.user.info?.token);
  const [mapData, setMapData] = useState<mapType>();
  const [socket, setSocket] = useState<WebSocket>();

  const getMapDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/maps/space/${room}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      console.log(response.data);
      setMapData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token === "" || !token) {
      navigate("/login");
    } else {
      dispatch(loginUser({ token, username }));
    }
    getMapDetails();
    const wss = new WebSocket("ws://localhost:8080");
    wss.onopen = () => {
      console.log("socket is opened");
      setSocket(wss);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center relative bg-slate-700">
      {socket && mapData && (
        <div>
          <Game socket={socket} mapData={mapData} room={room} />
          <div className="absolute bottom-0">
            <Chat socket={socket} room={room} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Metaverse;
