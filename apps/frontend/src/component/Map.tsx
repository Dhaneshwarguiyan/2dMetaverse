import { useNavigate } from "react-router-dom";
import Options from "../icons/Options";
import map from "../assets/map1.png";
import { useDispatch } from "react-redux";
import { initMap } from "../slices/mapSlice";
import SpaceOptions from "./SpaceOptions";
import { useEffect, useRef, useState } from "react";

interface propType {
  name: string;
  type: "owner" | "guest";
  removeVisitedSpaces: (arg0: string) => void;
}

const Map = ({ name, type, removeVisitedSpaces }: propType) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const optionsDialogRef = useRef<HTMLDivElement>(null);

  const [optionsDialog, setOptionsDialog] = useState<boolean>(false);
  const handleSpace = () => {
    dispatch(initMap(name)); //may be I dont need this cause i am using params to get/set room
    navigate(`/${name}`);
  };

  const closeOnClickOutside = (e: MouseEvent) => {
    if (
      !(
        e.target instanceof Node &&
        optionsDialogRef.current &&
        optionsDialogRef.current.contains(e.target)
      )
    ) {
      setOptionsDialog(false);
    }
  };
  useEffect(() => {
    window.addEventListener("mousedown", closeOnClickOutside);
    return () => {
      window.removeEventListener("mousedown", closeOnClickOutside);
    };
  }, []);

  return (
    <div className="w-[283px] cursor-pointer">
      <img
        src={map}
        alt="map"
        className="w-[283px] h-[170px] rounded-lg object-cover"
        onClick={handleSpace}
      />
      <div className="flex justify-between px-2 mt-2">
        <span>{name}</span>
        <span className="relative">
          <span
            onClick={() => {
              setOptionsDialog(!optionsDialog);
            }}
          >
            <Options />
          </span>
          <span ref={optionsDialogRef}>
            {optionsDialog && (
              <SpaceOptions
                setOptionsDialog={setOptionsDialog}
                room={name}
                type={type}
                removeVisitedSpaces={removeVisitedSpaces}
              />
            )}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Map;
