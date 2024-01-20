const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const { string } = require("yup");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = {
  index(req, res, next) {
    const successMsg = req.flash("success-msg");
    res.render("index", { successMsg, req });
  },
  login(req, res) {
    const msg = req.flash("msg");
    res.render("login", { req, msg });
  },
  async handleLogin(req, res, next) {
    const rule = {
      email: string()
        .required("Email bắt buộc phải nhập.")
        .email("Email không đúng định dạng."),
      password: string().required("Mật khẩu bắt buộc phải nhập."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });
        if (!user) {
          req.flash("msg", "Email không tồn tại");
        } else {
          const userData = user?.dataValues;
          const passwordValid = await bcrypt.compare(
            body.password,
            user.password
          );
          if (!passwordValid) {
            req.flash("msg", "Email/Password không đúng");
          } else {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            });

            res.cookie("access_token", token);

            const userSession = {
              name: userData.name,
              email: userData.email,
              accessToken: token,
            };

            req.session.userSession = userSession;
            req.flash("success-msg", "Đăng nhập thành công");
            return res.redirect("/");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/dang-nhap");
  },
  async logout(req, res, next) {
    delete req.session.userSession;
    if (req.session.userSession) {
      console.log(`still there`);
    } else {
      console.log(`mat roi`);
    }
    // res.clearCookie("access_token");
    return res.redirect("/dang-nhap");
  },
};
