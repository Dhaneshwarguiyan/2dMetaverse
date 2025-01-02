import icon from "../assets/icon.png";
import Button from "./ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";
import ProfileDropDown from "./ProfileDropDown";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  const dropDownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.addEventListener("mousedown", closeEventHandler);
    return () => {
      document.removeEventListener("mousedown", closeEventHandler);
    };
  }, []);
  const closeEventHandler = (e: MouseEvent) => {
    if (
      e.target instanceof Node &&
      dropDownRef.current &&
      !dropDownRef.current.contains(e.target)
    ) {
      setIsActive(false);
    }
  };

  return (
    <div>
      <div className="w-[1180px] mx-auto h-[60px] flex justify-between items-center mb-4">
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={icon} alt="icon" className="w-[50px]" />
          <span className="text-blue-600 text-3xl font-extrabold">Trek</span>
        </div>
        {!user.loggedin ? (
          <div className="h-full flex gap-3 items-center">
            <span
              onClick={() => {
                navigate("/login");
              }}
            >
              <Button text="Sign in" type="primary" />
            </span>
            <span
              onClick={() => {
                navigate("/signup");
              }}
            >
              <Button text="Sign up" type="secondary" />
            </span>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 relative cursor-pointer"
            onClick={() => {
              setIsActive(!isActive);
            }}
            ref={dropDownRef}
          >
            <span className="text-gray-500">{user.info?.username}</span>
            <img src={profile} alt="profile" className="w-[35px]" />
            {isActive && (
              <span className="absolute top-10 right-0">
                <ProfileDropDown />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
