import { useState } from "react";
import axios from "axios";
import InputField from "../component/ui/InputField";
import Button from "../component/ui/Button";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
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
        `${import.meta.env.VITE_API}/api/v1/users/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[500px] flex flex-col border border-blue-200 rounded-lg px-4 py-6 text-sm mx-auto mt-32">
      <div className="mx-auto mb-4">
        <span className="text-xl">
          Signup into{" "}
          <span className="text-2xl text-blue-800 font-extrabold">Trek</span>
        </span>
      </div>
      <InputField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        placeholder="username"
        handler={inputHandler}
      />
      <InputField
        label="firstname"
        type="text"
        name="username"
        value={formData.firstName}
        placeholder="firstname"
        handler={inputHandler}
      />
      <InputField
        label="lastname"
        type="text"
        name="lastname"
        value={formData.username}
        placeholder="lastname"
        handler={inputHandler}
      />
      <InputField
        label="email"
        type="email"
        name="email"
        value={formData.email}
        placeholder="jhondoe@gmail.com"
        handler={inputHandler}
      />
      <InputField
        label="password"
        type="password"
        name="password"
        value={formData.password}
        placeholder="password"
        handler={inputHandler}
      />
      <span onClick={submitHandler} className="mx-auto mt-4">
        <Button text="Submit" type="primary" />
      </span>
    </div>
  );
};

export default SignupPage;
