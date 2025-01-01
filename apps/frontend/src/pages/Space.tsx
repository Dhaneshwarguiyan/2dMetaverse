import NavPanel from "../component/NavPanel"
import Map from "../component/Map";
import { useEffect, useState } from "react";
import axios from "axios";

// const maps = [{thumbnail:map,name:"My Map 1"}]
interface mapType {
  room:string;
  id:number;
  mapId:number;
  userId:number;
}

const Space = () => {
  const [maps,setMap] = useState<mapType[]>();
  const token = localStorage.getItem('token');
  const getSpaces = async()=>{
    try {
      const response = await axios.get('http://localhost:8000/api/v1/maps/spaces/all',{
        headers:{
          "Authorization":`${token}`
        }
      })
      setMap(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getSpaces();
  },[])
  return (
    <div className="w-[1180px] mx-auto">
        <NavPanel />
        <div className="flex flex-wrap gap-4">
        {maps &&
          maps.map((map,key)=>{
            return <Map  name={map.room} key={key}/>
          })
        }
        </div>

    </div>
  )
}

export default Space
