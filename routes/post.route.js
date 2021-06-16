const router = require("express").Router();

const { postController } = require("../controllers");
const { isAuth, isAdmin } = require("../middleware");
const { uploadFile } = require("../services");

router
  .route("/")
  .get(postController.getApprovePosts)

  .post(isAuth, uploadFile.array("images"), postController.createPost);

router.route("/all").get(isAuth, isAdmin, postController.getPosts);

router.route("/pending").get(isAuth, postController.getPendingPosts);
router.route("/approve").get(isAuth, postController.getApprovePosts);

router
  .route("/saved")
  .get(isAuth, postController.getSavedPosts)
  .post(isAuth, postController.createSavedPost);

router
  .route("/comments")
  .get(isAuth, isAdmin, postController.getAllComments)
  .post(isAuth, postController.getComments);

router
  .route("/:id")
  .get(postController.getPost)
  .put(isAuth, isAdmin, postController.updatePost)
  .delete(isAuth, isAdmin, postController.deletePost);

router
  .route("/:id/like-or-unlike")
  .get(isAuth, postController.likeOrUnlikePost);

router.route("/:id/comment").post(isAuth, postController.commentPost);

router
  .route("/comments/:id")
  .put(isAuth, isAdmin, postController.updatePostComment)
  .delete(isAuth, isAdmin, postController.deleteComment);

module.exports = router;
