// const { Op, where } = require("sequelize");
// const { User } = require("../models/index");

module.exports = async (req, res, next) => {
  if (!req.session?.userSession && req.url === "/") {
    return res.redirect("/dang-nhap");
  } else if (
    req.session?.userSession &&
    (req.url === "/dang-nhap" || req.url === "/dang-ky")
  ) {
    return res.redirect("/");
  }
  next();
};
