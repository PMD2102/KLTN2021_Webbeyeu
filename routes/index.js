const userRoute = require("./user.route");
const communityRoute = require("./community.route");
const postRoute = require("./post.route");
const roomRoute = require("./room.route");
const uploadRoute = require("./upload.route");
const reportRoute = require("./report.route");
const searchRoute = require("./search.route");

const combineRoute = (app) => {
  app.use("/api/users", userRoute);
  app.use("/api/community", communityRoute);
  app.use("/api/posts", postRoute);
  app.use("/api/rooms", roomRoute);
  app.use("/api/uploads", uploadRoute);
  app.use("/api/report", reportRoute);
  app.use("/api/search", searchRoute);

  return app;
};

module.exports = combineRoute;
