const { POST_STATUS, NOTIFY_TYPE } = require("../config/keys");
const CommunityMember = require("../models/CommunityMember");
const Post = require("../models/Post");
const User = require("../models/User");
const PostComment = require("../models/PostComment");
const PostLike = require("../models/PostLike");
const SavedPost = require("../models/SavedPost");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { getSocketIdFromRedis } = require("../sockets/helper");
const e = require("cors");
const IORedis = require("ioredis");
const { isAuth } = require("../middleware/isAuth");

const createPost = async (req, res) => {
  try {
    const filenames = req.files.map((file) => file.filename);

    const { _id } = req.user;
    const { title, communityId, content } = req.body;
    const communityMember = await CommunityMember.findOne({
      user: _id,
      community: communityId,
    });
    if (!communityMember)
      return res.status(400).send("You haven't joined community");
    const newPost = new Post({
      author: _id,
      title,
      community: communityId,
      content,
      images: filenames,
    });
    await newPost.save();
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["_id", "name", "username", "avatar", "tag"])
      .populate("community", ["_id", "name", "avatar"]);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.aggregate([
      {
        $match: {
          status: POST_STATUS.APPROVE,
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "post_likes",
          localField: "_id",
          foreignField: "post",
          as: "likesOfPost",
        },
      },
      {
        $lookup: {
          from: "post_comments",
          let: { postId: "$_id", qty: 100 },
          pipeline: [
            // {
            //   $unwind: {
            //     path: "$post"
            //   }
            // },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$status", POST_STATUS.APPROVE] },
                  ],
                },
              },
            },
          ],
          // localField: "_id",
          // foreignField: "post",
          as: "commentsOfPost",
        },
      },
      {
        $project: {
          _id: "$_id",
          author: "$author",
          community: "$community",
          title: "$title",
          content: "$content",
          images: "$images",
          comments: "$commentsOfPost",
          likes: "$likesOfPost",
          status: "$status",
          createdAt: "$createdAt",
          totalLike: { $size: "$likesOfPost" },
          totalComment: { $size: "$commentsOfPost" },
        },
      },
    ]);

    if (!posts.length) return res.status(400).send("NOT_FOUND");

    const _posts = await Post.populate(posts, {
      path: "author",
      select: ["_id", "name", "username", "avatar", "tag"],
    });
    const __posts = await Post.populate(_posts, {
      path: "community",
      select: ["_id", "name", "avatar"],
    });

    const result = await Promise.all(
      __posts.map(async (post) => {
        if (post.comments?.length) {
          const comments = await Promise.all(
            post.comments.map(async (comment) => {
              const author = comment.author
                ? await User.findById(comment.author)
                : null;
              return { ...comment, author };
            })
          );
          return { ...post, comments };
        }
        return post;
      })
    );

    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getApprovePosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          status: POST_STATUS.APPROVE,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "post_likes",
          localField: "_id",
          foreignField: "post",
          as: "likesOfPost",
        },
      },
      {
        $lookup: {
          from: "post_comments",
          let: { postId: "$_id", qty: 100 },
          pipeline: [
            // {
            //   $unwind: {
            //     path: "$post"
            //   }
            // },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$status", POST_STATUS.APPROVE] },
                  ],
                },
              },
            },
          ],
          // localField: "_id",
          // foreignField: "post",
          as: "commentsOfPost",
        },
      },
      {
        $project: {
          _id: "$_id",
          author: "$author",
          community: "$community",
          title: "$title",
          content: "$content",
          images: "$images",
          likes: "$likesOfPost",
          comments: "$commentsOfPost",
          status: "$status",
          createdAt: "$createdAt",
          totalLike: { $size: "$likesOfPost" },
          totalComment: { $size: "$commentsOfPost" },
        },
      },
    ]);
    // .populate("author", ["_id", "name", "username", "avatar"])
    // .populate("community", ["_id", "name", "avatar"]);
    const _post = await Post.populate(posts, {
      path: "author",
      select: ["_id", "name", "username", "avatar", "tag"],
    });
    const __post = await Post.populate(_post, {
      path: "community",
      select: ["_id", "name", "avatar"],
    });
   
    const result = await Promise.all(
      __post.map(async (post) => {
        if (post.comments?.length) {
          const comments = await Promise.all(
            post.comments.map(async (comment) => {
              const author = comment.author
                ? await User.findById(comment.author)
                : null;
              return { ...comment, author };
            })
          );
          return { ...post, comments };
        }
        return post;
      })
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPendingPosts = async (req, res) => {
  try {
    const { _id } = req.user;
    const posts = await Post.find({
      author: _id,
      status: POST_STATUS.PENDING,
    })
      .populate("author", ["_id", "name", "username"])
      .populate("community", ["_id", "name", "avatar"]);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOwnerApprovePosts = async (req, res) => {
  try {
    const { _id } = req.user;
    const posts = await Post.find({
      author: _id,
      status: POST_STATUS.APPROVE,
    })
      .populate("author", ["_id", "name", "username"])
      .populate("community", ["_id", "name", "avatar"]);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("author", ["_id", "name", "username"])
      .populate("community", ["_id", "name", "avatar"]);

    const { status } = req.body;
    // save notify
    if (status) {
      const notification = new Notification({
        user: post.author._id,
        type: NOTIFY_TYPE.post,
        status,
        object: post.title,
      });
      await notification.save();
      const socket = await getSocketIdFromRedis(post.author._id);
      req.app.locals.socketIo.to(socket).emit("new-notification", notification);
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const likeOrUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { _id: userId } = req.user;
    const query = { user: userId, post: postId };
    const like = await PostLike.findOne(query);
    if (!like) {
      await new PostLike(query).save();
    } else {
      await like.remove();
    }
    const likeUser = await PostLike.findOne(query);
    const data = {
      isLike: !!like, 
      userLike: likeUser,
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const commentPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { _id: userId } = req.user;
    const { content } = req.body;

    const newComment = new PostComment({
      author: userId,
      post: postId,
      content,
    });
    await newComment.save();
    console.log(newComment);
    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await PostComment.findByIdAndDelete(id);
    res.send("success");
  } catch (err) {
    console.log(error);
    res.status(500).json(err);
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await PostComment.find()
      .populate("author", ["_id", "name", "username"])
      .populate("post", ["title"]);
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getComments = async (req, res) => {
  try {
    const { _id } = req.user;
    const { type } = req.body;
    if (
      type === POST_STATUS.PENDING ||
      type === POST_STATUS.APPROVE ||
      type === POST_STATUS.REJECT
    ) {
      console.log(type);
      const comments = await PostComment.find({
        author: _id,
        status: type,
      })
        .populate("author", ["_id", "name", "username"])
        .populate("post", ["title", "images"]);
      res.json(comments);
    } else return res.status(400).send("INVALID_STATUS");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updatePostComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await PostComment.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("author", ["_id", "name", "username"])
      .populate("post", ["title"]);
    const { status } = req.body;
    // save notify
    if (status) {
      const notification = new Notification({
        user: comment.author._id,
        type: NOTIFY_TYPE.comment,
        status,
        object: comment.content,
      });
      await notification.save();
      const socket = await getSocketIdFromRedis(comment.author._id);
      req.app.locals.socketIo.to(socket).emit("new-notification", notification);
    }

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const createSavedPost = async (req, res) => {
  try {
    const { _id } = req.user;
    const { postId } = req.body;

    const payload = {
      user: _id,
      post: postId,
    };

    const savedPost = await SavedPost.findOne(payload);
    if (savedPost) return res.status(400).send("Bài viết đã được lưu");

    await new SavedPost(payload).save();
    res.send("success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const { _id } = req.user;
    const savedPosts = await SavedPost.find({ user: _id });

    const ids = savedPosts.map((savedPost) => savedPost.post);
    if (!ids.length) return res.json([]);

    const posts = await Post.aggregate([
      {
        $match: {
          _id: { $in: ids },
          status: POST_STATUS.APPROVE,
        },
      },
      {
        $lookup: {
          from: "post_likes",
          localField: "_id",
          foreignField: "post",
          as: "likesOfPost",
        },
      },
      {
        $lookup: {
          from: "post_comments",
          let: { postId: "$_id", qty: 100 },
          pipeline: [
            // {
            //   $unwind: {
            //     path: "$post"
            //   }
            // },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$status", POST_STATUS.APPROVE] },
                  ],
                },
              },
            },
          ],
          // localField: "_id",
          // foreignField: "post",
          as: "commentsOfPost",
        },
      },
      {
        $project: {
          _id: "$_id",
          author: "$author",
          community: "$community",
          title: "$title",
          content: "$content",
          images: "$images",
          comments: "$commentsOfPost",
          status: "$status",
          createdAt: "$createdAt",
          totalLike: { $size: "$likesOfPost" },
          totalComment: { $size: "$commentsOfPost" },
        },
      },
    ]);
    // .populate("author", ["_id", "name", "username", "avatar"])
    // .populate("community", ["_id", "name", "avatar"]);
    const _post = await Post.populate(posts, {
      path: "author",
      select: ["_id", "name", "username", "avatar"],
    });
    const __post = await Post.populate(_post, {
      path: "community",
      select: ["_id", "name", "avatar"],
    });

    const result = await Promise.all(
      __post.map(async (post) => {
        if (post.comments?.length) {
          const comments = await Promise.all(
            post.comments.map(async (comment) => {
              const author = comment.author
                ? await User.findById(comment.author)
                : null;
              return { ...comment, author };
            })
          );
          return { ...post, comments };
        }
        return post;
      })
    );
    // console.log(result[0]);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getApprovePosts,
  getPendingPosts,
  getOwnerApprovePosts,
  updatePost,
  deletePost,
  likeOrUnlikePost,
  commentPost,
  getAllComments,
  getComments,
  updatePostComment,
  createSavedPost,
  getSavedPosts,
  deleteComment,
};
