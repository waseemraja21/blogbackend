import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { BiCheck } from "react-icons/bi";
import { UserContext } from "../Context/userContext";
import axios from "axios";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";
export default function UserProfile() {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useContext(UserContext);
  // console.log(currentUser);

  const token = currentUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/users/${currentUser?.userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      const { name, avatar } = response.data;
      setName(name);
      setAvatar(avatar);
    };

    getUser();
  }, []);

  const updateUserDetails = async (ev) => {
    ev.preventDefault();

    try {
      const userData = new FormData();
      userData.set("name", name);
      console.log(currentUser?.name);

      userData.set("currentPassword", currentPassword);
      userData.set("newPassword", newPassword);
      userData.set("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        `${REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const updateAvatar = async (ev) => {
    ev.preventDefault();

    setIsAvatarTouched(false);

    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("response", response.data);

      setAvatar(response?.data.avatar);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const image = `${REACT_APP_ASSETS_URL}/uploads/${avatar}`;
  console.log("image", image);
  console.log("avatar", avatar);

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={"/myposts/" + currentUser.userId} className="btn">
          My Posts
        </Link>

        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img src={`${REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={""} />{" "}
            </div>
            {/* form to update avatar */}
            <form
              className="avatar_form"
              onSubmit={updateAvatar}
              encType="multipart/form-data"
            >
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
                accept=".png , .jpg , .jpeg"
              />
              {/* <label htmlFor='avatar' onClick={()=> setIsAvatarTouched(true)}><FiEdit/></label> */}
              {/* {isAvatarTouched &&  <button type='submit' className='profile_avatar-btn'><BiCheck/></button>} */}
              <button type="submit" className="btn primary">
                Update Photo
              </button>
            </form>
          </div>
          <>{currentUser.name}</>
          {/* form to update user details */}

          <form className="form profile_form" onSubmit={updateUserDetails}>
            {error && <p className="form_error-message">{error}</p>}
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
