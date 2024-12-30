import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../slices/userslice";

const LoggedIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      layout of protected routes
      <button onClick={()=>{dispatch(logoutUser());localStorage.setItem("token","");navigate('/')}}>Logout</button>
      <Outlet />
    </div>
  )
}

export default LoggedIn
