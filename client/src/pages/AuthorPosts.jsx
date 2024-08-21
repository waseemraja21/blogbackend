import React, { useEffect, useState } from "react";
import PostItem from "../Component/PostItem";
import axios from "axios";
import Loader from "../Component/Loader";
import { useParams } from "react-router-dom";

const REACT_APP_BASE_URL = "http://localhost:5000/api";

export default function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/users/${id}`);
        if (!response.ok) console.log("response error");
        setAuthor(response?.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getAuthor();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/posts/users/${id}`
        );
        setPosts(response?.data);
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
    <section className="posts">
      {posts.length > 0 ? (
        <>
          <h2 className="center"> Posts by {author.name}</h2>
          <div className="container posts_container">
            {posts.map(
              ({
                _id: id,
                thumbnail,
                category,
                title,
                description,
                creator,
                createdAt,
              }) => (
                <PostItem
                  key={id}
                  postID={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  desc={description}
                  authorID={creator}
                  createdAt={createdAt}
                />
              )
            )}
          </div>
        </>
      ) : (
        <h2 className="center"> No posts found! </h2>
      )}
    </section>
  );
}
