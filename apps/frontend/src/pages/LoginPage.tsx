import { useState } from "react";
import axios from 'axios';
import { loginUser } from "../slices/userslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const inputHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value
      })
  }

  const submitHandler = async ()=>{
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login',{
        email:formData.email,
        password:formData.password
      })
      if(response){
        dispatch(loginUser(response.data.token));
        localStorage.setItem('token',response.data.token);
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      Login Page
      <input type="email" name="email" value={formData.email} placeholder="email" onChange={inputHandler}/>
      <input type="password" name="password" value={formData.password} placeholder="password" onChange={inputHandler}/>
      <button onClick={submitHandler}>submit</button>
    </div>
  )
}

export default LoginPage
