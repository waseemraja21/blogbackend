import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Component/Loader";

const authorsData = [];
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";

export default function Authors() {
  const [authors, setAuthors] = useState(authorsData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/users`);
        setAuthors(response.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map(({ _id: id, avatar, name, posts }) => {
            return (
              <div key={id} to={`posts/users/${id}`} className="author">
                <div className="author_avatar">
                  <img
                    src={`${REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                    alt={""}
                  />
                </div>
                <div className="author_info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Authors found!</h2>
      )}
    </section>
  );
}
