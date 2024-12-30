import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../component/Navbar";
import { useDispatch } from "react-redux";
import { loginUser } from "../slices/userslice";

const Navigate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      if(token === "" || !token){
        navigate('/');
      }else{
        dispatch(loginUser({token,username}))
        navigate('/home');
      }
    },[])

  return (
    <div className="w-[100vw] overflow-hidden">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Navigate
