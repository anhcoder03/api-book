const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //get token
  const token = req.headers.token;
  if (token) {
    //bearer fdsfasdfdsfsdfasdf
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You're not authenticated");
  }
};

const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id == req.params.id || req.user.admin) {
      next();
    } else {
      return res.status(403).json("You're not allowed to delete other");
    }
  });
};

module.exports = { verifyToken, verifyTokenAdmin };
