import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navigate = () => {
    const navigate = useNavigate();
    useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token === "" || !token){
        navigate('/');
      }else{
        navigate('/home');
      }
    },[])

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Navigate
