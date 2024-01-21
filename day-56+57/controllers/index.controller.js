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
    const logoutMsg = req.flash("logout-msg");
    const successMsg = req.flash("success-msg");
    const msg = req.flash("msg");
    res.render("login", { req, msg, successMsg, logoutMsg });
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
  register(req, res) {
    const msg = req.flash("msg");
    const passwordMsg = req.flash("password-msg");
    res.render("register", { msg, req, passwordMsg });
  },
  async handleRegister(req, res, next) {
    const rule = {
      name: string().required("Bạn phải có tên chứ."),
      email: string()
        .required("Email bắt buộc phải nhập.")
        .email("Email không đúng định dạng."),
      password: string().required("Mật khẩu bắt buộc phải nhập."),
      password2: string().required("Bắt buộc phải nhập lại mật khẩu."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });

        if (user) {
          req.flash("msg", "Email đã tồn tại.");
        } else {
          if (body.password !== body.password2) {
            req.flash("password-msg", "Hai mật khẩu không khớp.");
            // return res.redirect("/dang-ky");
          } else {
            await User.create({
              name: body.name,
              email: body.email,
              password: await bcrypt.hash(body.password, 15),
              password2: await bcrypt.hash(body.password2, 15),
            });

            req.flash("success-msg", "Tạo tài khoản thành công.");

            return res.redirect("/dang-nhap");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/dang-ky");
  },
  async logout(req, res, next) {
    req.flash("logout-msg", "Đăng xuất thành công.");
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
