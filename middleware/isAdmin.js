const { ROLE } = require("../config/keys");

const isAdmin = (req, res, next) => {
  if (req.user.role == ROLE.ADMIN) next();
  else return res.status(401).json("Unauthorized");
};

module.exports = isAdmin;
