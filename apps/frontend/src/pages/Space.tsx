import NavPanel from "../component/NavPanel";
import Map from "../component/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateSpace } from "../slices/renderSlice";

// const maps = [{thumbnail:map,name:"My Map 1"}]
interface mapType {
  room: string;
  id: number;
  mapId: number;
  userId: number;
}

const Space = () => {
  const dispatch = useDispatch();

  const [maps, setMap] = useState<mapType[]>();
  const [visitedMaps, setVisitedMap] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("My Space");
  const space = useSelector((state: RootState) => state.render.spaces);
  const token = localStorage.getItem("token");

  const getVisitedSpaces = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/maps/visitedSpaces`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      setVisitedMap(response.data.visitedRooms);
    } catch (error) {
      console.log(error);
    }
  };
  const getSpaces = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/maps/spaces/all`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      setMap(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeVisitedSpaces = async (remove: string) => {
    const newVisitedRooms = visitedMaps.filter((items) => {
      return items !== remove;
    });
    console.log(newVisitedRooms);
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/v1/maps/visitedSpaces/remove`,
        {
          room: newVisitedRooms,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      dispatch(updateSpace());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVisitedSpaces();
    getSpaces();
  }, [space]);

  return (
    <div className="w-[1180px] mx-auto">
      <NavPanel setActiveTab={setActiveTab} activeTab={activeTab} />
      {activeTab === "My Space" ? (
        <div className="flex flex-wrap gap-4">
          {maps &&
            maps.map((map, key) => {
              return (
                <Map
                  name={map.room}
                  key={key}
                  type="owner"
                  removeVisitedSpaces={removeVisitedSpaces}
                />
              );
            })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {visitedMaps &&
            visitedMaps.map((rooms, key) => {
              return (
                <Map
                  name={rooms}
                  key={key}
                  type="guest"
                  removeVisitedSpaces={removeVisitedSpaces}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Space;
