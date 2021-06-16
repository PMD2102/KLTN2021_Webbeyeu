const { POST_STATUS } = require("../config/keys");
const Community = require("../models/Community");
const CommunityMember = require("../models/CommunityMember");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const User = require("../models/User");

const createCommunity = async (req, res) => {
  try {
    const { originalname, mimetype, filename } = req.file;
    const { name, introduce } = req.body;

    const community_name = await Community.findOne({name: name})
    if(community_name) return res.status(400).json({msg: "Cộng đồng đã tồn tại."})

    const newCommunity = new Community({
      name,
      avatar: filename,
      introduce,
    });
    await newCommunity.save();

    const communities = await Community.aggregate([
      { $match: { _id: newCommunity._id } },
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
    if (!communities?.length) return res.status(400).send("ERROR");

    res.json(communities[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getCommunities = async (req, res) => {
  try {
    // const communities = await Community.find();
    const communities = await Community.aggregate([
      // { $match: { _id: podcastId } },
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
    // console.log(communities);
    res.json(communities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;
    const { _id } = req.user;
    if (!communityId) return res.status(400).send("communityId is required");
    const community = await Community.findById(communityId);
    if (!community) return res.status(400).send("communityId is not exists");
    const query = { user: _id, community: communityId };
    const communityMember = await CommunityMember.findOneAndUpdate(
      query,
      query,
      {
        upsert: true,
      }
    );
    if (communityMember)
      return res.status(400).send("you already join community");
    const _communityMember = await CommunityMember.findOne(query).populate(
      "community",
      ["name"]
    );
    res.json(_communityMember);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const quitCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;
    const { _id } = req.user;
    if (!communityId) return res.status(400).send("communityId is required");
    const community = await Community.findById(communityId);
    if (!community) return res.status(400).send("communityId is not exists");
    const communityMember = await CommunityMember.findOne({
      user: _id,
      community: communityId,
    });
    if (!communityMember)
      return res.status(400).send("you don't join community");
    // const _communityMember = await CommunityMember.findOne(query);
    await communityMember.remove();
    res.json(communityMember);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getJoinedCommunities = async (req, res) => {
  try {
    const { _id } = req.user;
    const joinedCommunities = await CommunityMember.find({
      user: _id,
    }).populate("community", ["name", "avatar"]);
    res.json(joinedCommunities);
  } catch (err) {
    console.log(err);
    res.status(500).json(error);
  }
};

const getApprovePostsOfCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const communities = await Community.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
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

    if (!communities.length) return res.status(400).send("NO_FOUND_COMMUNITY");

    const posts = await Post.aggregate([
      {
        $match: {
          // status: POST_STATUS.APPROVE,
          community: mongoose.Types.ObjectId(id),
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
    // console.log(result[0]);
    res.json({ community: communities[0], posts: result });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createCommunity,
  getCommunities,
  joinCommunity,
  quitCommunity,
  getJoinedCommunities,
  getApprovePostsOfCommunity,
};
