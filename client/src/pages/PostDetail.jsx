import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../Component/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Loader from "../Component/Loader";
import DeletePost from "./DeletePost";
import { UserContext } from "../Context/userContext";
import axios from "axios";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useContext(UserContext);
  console.log(currentUser);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    };

    getPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.userId === post?.creator && (
              <div className="post-detail_buttons">
                <Link
                  to={`/posts/${post?._id}/edit`}
                  className="btn sm primary"
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail_thumbnail">
            {console.log(`${REACT_APP_ASSETS_URL}/uploads/${post?.thumbnail}`)}
            <img
              src={`${REACT_APP_ASSETS_URL}/uploads/${post?.thumbnail}`}
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}
    </section>
  );
}
