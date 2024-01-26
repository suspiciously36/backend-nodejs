const { Op } = require("sequelize");
const { UserAgent } = require("../models/index");

module.exports = async (req, res, next) => {
  if (
    !req.session?.userSession &&
    (req.url === "/" ||
      req.url === "/doi-mat-khau" ||
      req.url === "/sua-thong-tin" ||
      req.url === "/thiet-bi")
  ) {
    return res.redirect("/dang-nhap");
  } else if (
    req.session?.userSession &&
    (req.url === "/dang-nhap" || req.url === "/dang-ky")
  ) {
    return res.redirect("/");
  }
  if (req.session?.userSession) {
    const data = await UserAgent.findAll({
      where: { id: { [Op.not]: req.session?.userSession?.userAgent_id } },
    });
    console.log(data);
    // if (!is_logged_in) {
    //   delete req.session.userSession;
    //   return res.redirect("/dang-nhap");
    // }
  }
  next();
};
