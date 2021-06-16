const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();
const { POST_STATUS } = require("../config/keys");
const PostComment = require("../models/PostComment");
const Community = require("../models/Community");

router.route("/").get(async (req, res) => {
  const { search } = req.query;

  // get posts
  const posts = await Post.aggregate([
    {
      $match: {
        status: POST_STATUS.APPROVE,
        $or: [
          { title: { $regex: new RegExp(search, "gi") } },
          { content: { $regex: new RegExp(search, "gi") } },
        ],
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
        comments: "$commentsOfPost",
        status: "$status",
        createdAt: "$createdAt",
        totalLike: { $size: "$likesOfPost" },
        totalComment: { $size: "$commentsOfPost" },
      },
    },
  ]);
  const _post = await Post.populate(posts, {
    path: "author",
    select: ["_id", "name", "username", "avatar", "tag"],
  });
  const __post = await Post.populate(_post, {
    path: "community",
    select: ["_id", "name", "avatar"],
  });
  const postResult = await Promise.all(
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

  // get comments
  const comments = await PostComment.find({
    content: { $regex: new RegExp(search, "gi") },
  })
    .populate("author", ["_id", "name", "username", "tag"])
    .populate("post", ["title"]);

  // get community
  const communities = await Community.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: new RegExp(search, "gi") } },
          // { introduce: { $regex: new RegExp(search, "gi") } },
        ],
      },
    },
    // { $unwind: '$episodes' },
    {
      $lookup: {
        from: "community_members",
        localField: "_id",
        foreignField: "community",
        as: "communityMembersCount",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "community",
        as: "communityPostsCount",
      },
    },
    {
      $project: {
        _id: "$_id",
        name: "$name",
        introduce: "$introduce",
        avatar: "$avatar",
        totalMember: { $size: "$communityMembersCount" },
        totalPost: { $size: "$communityPostsCount" },
      },
    },
  ]);

  res.json({ posts: postResult, comments, communities });
});

module.exports = router;
