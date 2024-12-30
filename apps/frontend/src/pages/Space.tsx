import NavPanel from "../component/NavPanel"
import map from '../assets/map1.png';
import Map from "../component/Map";

const maps = [{thumbnail:map,name:"My Map 1"}]

const Space = () => {
  return (
    <div className="w-[1180px] mx-auto">
        <NavPanel />
        <div className="flex flex-wrap gap-4">
        {
          maps.map((map,key)=>{
            return <Map thumbnail={map.thumbnail} name={map.name} key={key}/>
          })
        }
        </div>

    </div>
  )
}

export default Space
