import { useState } from "react";
import axios from "axios";

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
        "http://localhost:8000/api/v1/users/signup",
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
    <div>
      Signup page
      <input
        type="text"
        name="username"
        value={formData.username}
        placeholder="username"
        onChange={inputHandler}
      />
      <input
        type="text"
        name="firstname"
        value={formData.firstName}
        placeholder="firstname"
        onChange={inputHandler}
      />
      <input
        type="text"
        name="lastname"
        value={formData.lastName}
        placeholder="lastname"
        onChange={inputHandler}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="email"
        onChange={inputHandler}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="password"
        onChange={inputHandler}
      />
      <button onClick={submitHandler}>Submit</button>
    </div>
  );
};

export default SignupPage;
