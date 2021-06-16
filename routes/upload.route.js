const router = require("express").Router();

const { isAuth } = require("../middleware");
const { uploadFile } = require("../services");

router.route("/").post(isAuth, uploadFile.single("image"), (req, res) => {
  // console.log(req.file)
  const { originalname, mimetype, filename } = req.file;
  res.json({ originalname, mimetype, filename });
});

module.exports = router;
