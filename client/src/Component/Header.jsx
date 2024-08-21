import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Logo1 from "../images/logo1.jpg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../Context/userContext";

export default function Header() {
  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsNavShowing(window.innerWidth > 800);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeNavHandler = () => {
    setIsNavShowing(false);
  };

  /////THIS PAGE HAS ERROR DON'T FORGET TO CORRECT IT
  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          <img src={Logo1} alt="Navbar-logo" />
        </Link>

        {token && isNavShowing && (
          <ul className="nav_menu">
            {/* <li><Link to={'/myposts/'+currentUser.userId}  onClick={closeNavHandler}> My Posts</Link></li> */}
            <li>
              <Link
                to={`profile/${currentUser?.userId}`}
                onClick={closeNavHandler}
              >
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to={"/create"} onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to={"/authors"} onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to={"/logout"} onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}

        {!currentUser && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to={"/authors"} onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to={"/login"} onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}

        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}
