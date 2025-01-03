import axios from "axios";
import Copy from "../icons/Copy";
import Delete from "../icons/Delete";
import { useDispatch } from "react-redux";
import { updateSpace } from "../slices/renderSlice";

const SpaceOptions = ({
  setOptionsDialog,
  room,
}: {
  setOptionsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
}) => {
  const dispatch = useDispatch();
  const deleteSpace = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/maps/delete`,
        {
          room,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(response.data);
      dispatch(updateSpace());
      closeOptions();
    } catch (error) {
      console.log(error);
    }
  };
  const closeOptions = () => {
    setOptionsDialog(false);
  };
  return (
    <div className="bg-white absolute z-10 bottom-8 right-0 shadow-md rounded-lg border p-4 text-nowrap text-sm">
      <div className="flex items-center gap-2" onClick={closeOptions}>
        <span>
          <Copy />
        </span>
        <span>Copy Space</span>
      </div>
      <div
        className="flex items-center gap-2 text-red-500 border-t-2 pt-2 mt-2"
        onClick={deleteSpace}
      >
        <span>
          <Delete />
        </span>
        <span>Delete Space</span>
      </div>
    </div>
  );
};

export default SpaceOptions;
