const Post = require("../models/PostModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const { log } = require("console");

//=========================================CREATE POST
//POST: api/posts
//PROTECTED

const createPost = async (req, res, next) => {
  console.log(req.body);

  try {
    let { title, category, description } = req.body;
    let { thumbnail } = req.files;
    // console.log(thumbnail);

    if (!title || !category || !description || !thumbnail) {
      return next(
        new HttpError("Fill in all the fields and choose thumbnail", 422)
      );
    }

    if (thumbnail.size > 10000000) {
      return next(
        new HttpError("Thumbnail too big! File should be less than 2mb.")
      );
    }
    let fileName = thumbnail.name;

    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError("err"));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFilename,
            creator: req.user.userId,
          });
          if (!newPost) {
            return next(new HttpError("Post couldn't be created.", 422));
          }
          //find user and increase post count by one
          const currentUser = await User.findById(req.user.userId);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.userId, {
            posts: userPostCount,
          });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================GET ALL  POSTS
//get: api/posts
//unPROTECTED

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================GET SINGLE POST
//POST: api/posts/:ID
//unPROTECTED

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================GET POSTS BY CATEGORY
//GET: api/posts/categories/:category
//UNPROTECTED

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================GET USER/AUTHOR  POST
//GET: api/posts/users/:id//userId
//UNPROTECTED

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================Edit POST
//PATCH: api/posts/:ID
//PROTECTED

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    let { title, category, description } = req.body;

    //ReactQuill has a paragraph opening and closing tag with a break tag in between so there are
    // 11 characters in there already
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    if (!req.files) {
      if (req.user.userId == post.creator) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description },
          { new: true }
        );
      } else {
        return next(new HttpError("You can't edit this post"));
      }
    } else {
      // get old post from db
      const oldPost = await Post.findById(postId);
      if (req.user.userId == oldPost.creator) {
        try {
          await fs.promises.unlink(
            path.join(__dirname, "..", "uploads", oldPost.thumbnail)
          );
        } catch (err) {
          return next(new HttpError(err)); // Handle the deletion error
        }
        //upload new thumbnail
        const { thumbnail } = req.files;
        //check file size
        if (thumbnail.size > 2000000) {
          return next(
            new HttpError("Thumbnail too big should be less than 2mb.")
          );
        }
        fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        newFilename =
          splittedFileName[0] +
          uuid() +
          "." +
          splittedFileName[splittedFileName.length - 1];

        //move the uploaded files to desired location
        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFilename),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFilename },
          { new: true }
        );
      } else {
        return next(new HttpError("You can't edit this post."));
      }
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========================================DELETE POST
//DELETE: api/posts/:id
//PROTECTED

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavailable.", 400));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post unvailable.", 400));
    }
    //console.log(post);

    const fileName = post.thumbnail;
    //console.log(req.user);

    // console.log(req.user.userId );
    // console.log(post.creator);

    if (req.user.userId == post.creator) {
      //delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            //find user and reduce post count by 1;
            const currentUser = await User.findById(req.user.userId);
            const userPostCount = currentUser.posts - 1;
            await User.findByIdAndUpdate(req.user.userId, {
              posts: userPostCount,
            });
          }
        }
      );
      res.json("Post " + postId + " deleted successfully");
    } else {
      return next(new HttpError("You can't delete this post.", 400));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
