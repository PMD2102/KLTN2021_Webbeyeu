const router = require("express").Router();

const { userController } = require("../controllers");
const { isAuth, isAdmin } = require("../middleware");

router.route("/").get(isAuth, userController.getUsers);

router
  .route("/notifications")
  .get(isAuth, userController.getNotifications)
  .post(isAuth, userController.readNotifications);

router
  .route("/:id")
  .get(isAuth, userController.getUser)
  .put(isAuth, userController.updateUser)
  .delete(isAuth, userController.deleteUser);

router.route("/change-password").post(isAuth, userController.changePassword);

router.route("/sign-up").post(userController.signUp);
router.route("/sign-in").post(userController.signIn);
router.route("/sign-in/facebook").post(userController.facebookSignIn);

router
  .route("/:id/lock-or-unlock")
  .post(isAuth, isAdmin, userController.lockOrUnlockUser);

router
  .route("/reset-password")
  .post(userController.resetPassword);

module.exports = router;
