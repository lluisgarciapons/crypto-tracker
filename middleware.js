let jwt = require("jsonwebtoken");
const User = require("./models/User");

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Auth token is not supplied"
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid"
      });
    } else {
      req.user = decoded;
      next();
    }
  });
};

let mySite = async (req, res, next) => {
  const { user: { _id }, params: { siteId } } = req;

  let user = await User.findById(_id);

  let index = user.sites.indexOf(siteId);

  if (index < 0) {
    return res.status(401).json({
      success: false,
      message: "You don't own this site."
    });
  }

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 400).send({
    success: false,
    message: err._message || err.message
  });
};

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  checkToken,
  errorHandler,
  asyncMiddleware,
  mySite
};