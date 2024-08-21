import React, { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../Context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const REACT_APP_BASE_URL = "http://localhost:5000/api";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const POST_CATEGORIES = [
  "Agriculture",
  "Business",
  "Education",
  "Entertainment",
  "Art",
  "Investment",
  "Uncategorized",
  "Weather",
];

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //redirect to login for any isn't logged in

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const createPost = async (ev) => {
    ev.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/posts`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        return navigate("/");
      }
    } catch (err) {
      setError(err.response.data.message);
      //this should be setError check for debugging

      //setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="error">{error}</p>}
        <form className="form create_post-form" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(ev) => setThumbnail(ev.target.files[0])}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </div>
    </section>
  );
}
