import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../Context/userContext";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";
export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const loginUser = async (ev) => {
    ev.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/users/login`,
        userData
      );
      const user = await response.data;
      console.log(response);

      // the data that is given back by Login we save it for userContext
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      // Handle errors more gracefully
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      ); // Use optional chaining and fallback message
    }
  };

  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn_primary">
            Login
          </button>
        </form>
        <small>
          Don't have an account? <Link to={"/register"}>Sign Up</Link>
        </small>
      </div>
    </section>
  );
}
