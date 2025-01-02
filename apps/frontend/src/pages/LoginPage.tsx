import { useState } from "react";
import axios from "axios";
import { loginUser } from "../slices/userslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../component/ui/Button";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );
      if (response) {
        dispatch(
          loginUser({
            token: response.data.token,
            username: response.data.username,
          }),
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[300px] flex flex-col border border-blue-200 rounded-lg px-3 py-6 text-base mx-auto mt-32">
      <div className="mx-auto mb-4">
        <span className="text-xl">
          Log into{" "}
          <span className="text-2xl text-blue-800 font-extrabold">Trek</span>
        </span>
      </div>
      <label htmlFor="email" className="flex flex-col gap-2 mb-3">
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="email"
          onChange={inputHandler}
          className="text-sm border py-2 px-2 rounded-lg text-gray-700"
        />
      </label>
      <label htmlFor="password" className="flex flex-col gap-2 mb-5">
        Password
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="password"
          onChange={inputHandler}
          className="text-sm border py-2 px-1 rounded-lg text-gray-700"
        />
      </label>
      <span onClick={submitHandler} className="mx-auto">
        <Button text="Submit" type="primary" />
      </span>
    </div>
  );
};

export default LoginPage;
