const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

// CORS configuration
app.use(
  cors({
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    origin: "https://blogclient-iota.vercel.app", // frontend origin
  })
);


mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rth5xhw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

//starting frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
