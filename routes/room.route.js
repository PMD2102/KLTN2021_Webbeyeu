const router = require("express").Router();

const { roomController } = require("../controllers");
const { isAuth } = require("../middleware");

router
  .route("/")
  .get(isAuth, roomController.getRooms)
  .post(isAuth, roomController.createRoom);
// .delete(isAuth, roomController.deleteContact);

router.route("/:id").get(isAuth, roomController.getMessagesOfRoom);

router.route("/private").post(isAuth, roomController.getPrivateRoom);

module.exports = router;
