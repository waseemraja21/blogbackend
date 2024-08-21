import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Component/Loader";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";

export default function DeletePost({ postId: id }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const [isLoading, setIsLoading] = useState(false);

  //redirect to login for any isn't logged in

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${REACT_APP_BASE_URL}/posts/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser?.userId}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setIsLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="btn sm danger"
      onClick={() => {
        removePost(id);
      }}
    >
      DeletePost
    </div>
  );
}
