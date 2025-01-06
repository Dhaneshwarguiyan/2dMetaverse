import Options from "../icons/Options";
import map from "../assets/map1.png";
import axios from "axios";
import { generateRandomString } from "../utils/randomString";
import { useDispatch } from "react-redux";
import { closeCreateSpaceDialog } from "../slices/toggleSlice";
import { updateSpace } from "../slices/renderSlice";

const MapTemplateCard = ({ name, id }: { name: string; id: number }) => {
  const dispatch = useDispatch();
  const createSpace = async () => {
    const room = generateRandomString(5);
    try {
      //use mutation func from use query to dynamically update on any changes
      await axios.post(
        `${import.meta.env.VITE_API}/api/v1/maps/spaces`,
        {
          room: room,
          mapId: id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      dispatch(updateSpace());
      dispatch(closeCreateSpaceDialog());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-[283px] cursor-pointer" onClick={createSpace}>
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

export default MapTemplateCard;
