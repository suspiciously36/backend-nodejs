module.exports = async (req, res, next) => {
  if (req.user && req.url.includes("/auth")) {
    return res.redirect("/");
  }

  next();
};
