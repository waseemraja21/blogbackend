import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
const REACT_APP_BASE_URL = "http://localhost:5000/api";
const REACT_APP_ASSETS_URL = "http://l ocalhost:5000";

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

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const handleThumbnailChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
    }
  };

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const { id } = useParams();
  const navigate = useNavigate();

  //redirect to login for any isn't logged in

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/posts/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (err) {
        console.log(err);
      }
    };
    getPost();
  }, []);

  const editPost = async (ev) => {
    ev.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await axios.patch(
        `${REACT_APP_BASE_URL}/posts/${id}/edit`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        return navigate("/");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="error">{error}</p>}
        <form className="form create_post-form" onSubmit={editPost}>
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
          {/* imageUpload */}
          <input
            type="file"
            onChange={handleThumbnailChange}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
}
