import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import Loader from "../Component/Loader";
import axios from "axios";
import DeletePost from "./DeletePost";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const token = currentUser?.token;
  const navigate = useNavigate();

  //redirect to login for any isn't logged in

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      {posts.length > 0 ? (
        <div>
          {posts.map((post) => {
            return (
              <article key={post.id} className="dashboard_post">
                <div className="dashboard_post-info">
                  <div className="dashboard_post-thumbnail">
                    <img
                      src={`${REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
                      alt=""
                    />
                  </div>
                  <h5> {post.title}</h5>
                </div>
                <div className="dashboard_post-actions">
                  <Link to={"/posts/" + post._id} className="btn sm">
                    View
                  </Link>
                  <Link
                    to={"/posts/" + post._id + "/edit"}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no posts yet!</h2>
      )}
    </section>
  );
}
