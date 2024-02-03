const { string } = require("yup");
const sendMail = require("../../utils/mail");
const { User, Provider } = require("../../models/index");
const { Op } = require("sequelize");
const md5 = require("md5");
const moment = require("moment");
const bcrypt = require("bcrypt");

module.exports = {
  login(req, res) {
    if (req.user) {
      return res.redirect("/");
    }
    const error = req.flash("error");
    res.render("auth/login", { error, req });
  },
  register(req, res) {
    const msg = req.flash("msg");
    const passwordMsg = req.flash("password-msg");
    res.render("auth/register", { msg, req, passwordMsg });
  },
  async handleRegister(req, res, next) {
    const rule = {
      name: string().required("You must have a name."),
      email: string()
        .required("Please enter your Email.")
        .email("Email wrong format."),
      password: string().required("Please enter your Password."),
      password2: string().required("Please re-enter your Password."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });

        if (user) {
          req.flash("msg", "Email already exists.");
        } else {
          if (body.password !== body.password2) {
            req.flash("password-msg", "Passwords do not match.");
          } else {
            const provider = await Provider.findOne({
              where: { name: `localEmail` },
            });
            if (provider) {
              await User.update(
                { provider_id: provider.id },
                { where: { email: body.email } }
              );
            }

            const newlyCreatedProvider = await Provider.findOne({
              where: { name: `localEmail` },
            });

            await User.create({
              name: body.name,
              email: body.email,
              password: await bcrypt.hash(body.password, 10),
              provider_id: newlyCreatedProvider.id,
            });

            req.flash("success-msg", "Account created successfully.");

            return res.redirect("/auth/login");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/auth/register");
  },
  forgotPassword(req, res) {
    const msg = req.flash("msg");
    const successMsg = req.flash("success-msg");
    const errorMsg = req.flash("error-msg");
    res.render("auth/forgotPassword", { req, msg, successMsg, errorMsg });
  },
  async handleForgotPassword(req, res, next) {
    try {
      const rule = {
        email: string().required("Vui lòng nhập email của bạn."),
      };
      const body = await req.validate(req.body, rule);
      if (body) {
        const user = await User.findOne({
          where: {
            email: {
              [Op.iLike]: body.email,
            },
          },
        });
        if (user) {
          const reset_token = md5(Math.random() + new Date().getTime());

          const expire_token = `${moment().add(15, "minutes").valueOf()}`;
          await User.update(
            {
              reset_token: reset_token,
              expire_token: expire_token,
            },
            {
              where: {
                email: {
                  [Op.iLike]: body.email,
                },
              },
            }
          );

          const content = `<a href="http://localhost:3000/auth/reset-password?email=${body.email}&reset_token=${reset_token}">Click me to reset your password!</a>`;
          const info = await sendMail(
            body.email,
            `You requested for a password reset.`,
            content
          );
          if (info) {
            req.flash(
              "success-msg",
              "Reset password link sent. Please check your email!"
            );
          }
        } else {
          req.flash("error-msg", "Email does not exist.");
        }
      }
    } catch (e) {
      return next(e);
    }
    return res.redirect("/auth/forgot-password");
  },
  async resetPassword(req, res, next) {
    const msg = req.flash("msg");
    const { email, reset_token } = req.query;
    try {
      const user = await User.findOne({
        where: { email: { [Op.iLike]: email } },
      });
      if (user.reset_token !== reset_token) {
        res.send("Token invalid.");
      }
      const timeNow = moment().valueOf();
      if (user.expire_token < timeNow) {
        res.send("Token expired.");
      }
    } catch (e) {
      return next(e);
    }
    // console.log(moment().valueOf());
    res.render("auth/resetPassword", { msg, req });
  },
  async handleResetPassword(req, res, next) {
    const rule = {
      password: string().required("Mật khẩu bắt buộc phải nhập."),
      password2: string().required("Bắt buộc phải nhập lại mật khẩu."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        if (body.password !== body.password2) {
          req.flash("error-msg", "Passwords do not match.");
        }
        await User.update(
          {
            password: bcrypt.hashSync(body.password, 10),
            reset_token: null,
            expire_token: null,
          },
          {
            where: { email: { [Op.iLike]: req.query.email } },
          }
        );
        const content = `<a href="http://localhost:3000/auth/login">You have reset password. Click me to log in and have fun!</a>`;
        await sendMail(
          req.query.email,
          `Reset password successfully.`,
          content
        );
        return res.redirect("/auth/login");
      } catch (e) {
        return next(e);
      }
    } else
      return res.redirect(
        `/auth/reset-password?email=${req.query.email}&reset_token=${req.query.reset_token}`
      );
  },
};
