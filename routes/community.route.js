const router = require("express").Router();

const { communityController } = require("../controllers");
const { isAuth, isAdmin } = require("../middleware");
const { uploadFile } = require("../services");

router
  .route("/")
  .get(communityController.getCommunities)
  .post(
    isAuth,
    isAdmin,
    uploadFile.single("image"),
    communityController.createCommunity
  );

router
  .route("/join")
  .get(isAuth, communityController.getJoinedCommunities)
  .post(isAuth, communityController.joinCommunity);

router.route("/quit").post(isAuth, communityController.quitCommunity);

router.route("/:id").get(communityController.getApprovePostsOfCommunity);

module.exports = router;
