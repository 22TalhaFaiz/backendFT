function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user; // ✅ attach user to request
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
}


module.exports = isAuthenticated;