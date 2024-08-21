import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const ASSETS_URL = "http://localhost:5000";

export default function PostItem({
  postID,
  category,
  title,
  desc,
  authorID,
  thumbnail,
  createdAt,
}) {
  const shortDesc = desc.length > 145 ? desc.substr(0, 145) + "..." : desc;
  // const postTitle = title.length > 30 ? title.substr(0, 30) +'...' : title;
  const postTitle = title;

  return (
    <article className="post">
      <div className="post_thumbnail">
        <img src={`${ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post_content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
      </div>
      <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
      <div className="post_footer">
        <PostAuthor authorID={authorID} createdAt={createdAt} />
        <Link to={`posts/categories/${category}`} className="btn category">
          {category}
        </Link>
      </div>
    </article>
  );
}
