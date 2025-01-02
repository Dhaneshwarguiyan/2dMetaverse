import { useNavigate } from "react-router-dom";
import Options from "../icons/Options";
import map from "../assets/map1.png";
import { useDispatch } from "react-redux";
import { initMap } from "../slices/mapSlice";

interface propType {
  name: string;
}

const Map = ({ name }: propType) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSpace = () => {
    dispatch(initMap(name));
    navigate("/meta");
  };

  return (
    <div className="w-[283px] cursor-pointer" onClick={handleSpace}>
      <img
        src={map}
        alt="map"
        className="w-[283px] h-[170px] rounded-lg object-cover"
      />
      <div className="flex justify-between px-2 mt-2">
        <span>{name}</span>
        <span>
          <Options />
        </span>
      </div>
    </div>
  );
};

export default Map;
