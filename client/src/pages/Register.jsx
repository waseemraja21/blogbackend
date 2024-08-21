import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";
export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (ev) => {
    ev.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = await response.data;
      if (!newUser) {
        setError("couldn't register user!");
      }

      navigate("/login");
    } catch (err) {
      // Handle errors more gracefully
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      ); // Use optional chaining and fallback message
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn_primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to={"/login"}>Sign In</Link>
        </small>
      </div>
    </section>
  );
}
