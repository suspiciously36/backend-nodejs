const { User, UserAgent } = require("../models/index");
const bcrypt = require("bcrypt");
const { string } = require("yup");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const DeviceDetector = require("node-device-detector");

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
        const detector = new DeviceDetector({
          clientIndexes: true,
          deviceIndexes: true,
          deviceAliasCode: false,
        });
        const userAgent = req.get("user-agent");
        const result = detector.detect(userAgent);

        const user = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });
        if (!user) {
          req.flash("msg", "Email không tồn tại.");
          return res.redirect("/dang-nhap");
        }
        const userData = user?.dataValues;

        const passwordValid = await bcrypt.compare(
          body.password,
          user.password
        );

        if (!userData.status) {
          if (!passwordValid) {
            req.flash("msg", "Email/Password không đúng.");
          } else {
            req.flash(
              "msg",
              "Tài khoản này chưa được kích hoạt. (err::status=false)"
            );
          }
        }
        if (!userData.email) {
          if (!passwordValid) {
            req.flash("msg", "Email/Password không đúng.");
          } else {
            req.flash("msg", "Email không tồn tại.");
          }
        } else {
          if (userData.status) {
            if (!passwordValid) {
              req.flash("msg", "Email/Password không đúng.");
            } else {
              // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              //   expiresIn: process.env.JWT_REFRESH_EXPIRATION,
              // });

              // res.cookie("access_token", token);

              await UserAgent.create({
                user_id: userData.id,
                device_type: result.device.type,
                os_name: result.os.name,
                client_name: result.client.name,
                user_agent: userAgent,
                login_time: "now()",
                is_logged_in: true,
              });

              const userAgentData = await UserAgent.findOne({
                where: { user_id: userData.id },
              });

              const userSession = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                is_logged_in: userAgentData.dataValues.is_logged_in,
              };

              req.session.userSession = userSession;
              req.flash("success-msg", "Đăng nhập thành công!");
              return res.redirect("/");
            }
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
          } else {
            await User.create({
              name: body.name,
              email: body.email,
              password: await bcrypt.hash(body.password, 15),
            });

            req.flash(
              "success-msg",
              "Tạo tài khoản thành công. Vui lòng liên hệ admin để kích hoạt chứ chưa vào được luôn đâu."
            );

            return res.redirect("/dang-nhap");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/dang-ky");
  },

  edit(req, res) {
    console.log(req.session.userSession.is_logged_in);

    const msg = req.flash("msg");
    const successMsg = req.flash("success-msg");
    res.render("infoUpdate", { req, msg, successMsg });
  },

  async handleEdit(req, res, next) {
    const rule = {
      name: string().required("Tên không được để trống."),
      email: string()
        .required("Email bắt buộc phải nhập.")
        .email("Email không đúng định dạng."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = req.session.userSession;
        const userEmail = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });
        if (userEmail && body.email !== user.email) {
          req.flash(
            "msg",
            "Email bạn muốn đổi đã tồn tại, vui lòng chọn cái khác."
          );
          return res.redirect("/sua-thong-tin");
        } else {
          await User.update(
            {
              name: body.name,
              email: body.email,
            },
            { where: { email: user.email } }
          );
          user.name = body.name;
          req.flash("success-msg", "Đổi thông tin thành công.");
          return res.redirect("/");
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/sua-thong-tin");
  },

  changePassword(req, res) {
    const msg = req.flash("msg");
    res.render("passwordChange", { req, msg });
  },

  async handleChangePassword(req, res, next) {
    const rule = {
      password: string().required("Cần phải nhập mật khẩu cũ."),
      newPassword: string().required("Cần phải nhập mật khẩu mới."),
      newPassword2: string().required("Cần phải nhập lại mật khẩu mới."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = req.session.userSession;
        const { dataValues: userLoggedIn } = await User.findOne({
          where: { email: { [Op.iLike]: user.email } },
        });
        const {
          dataValues: { id },
        } = await UserAgent.findOne({ where: { user_id: user.id } });
        const passwordValid = await bcrypt.compare(
          body.password,
          userLoggedIn.password
        );
        if (!passwordValid) {
          req.flash("msg", "Mật khẩu cũ không đúng.");
        } else {
          if (body.newPassword !== body.newPassword2) {
            req.flash("msg", "Hai mật khẩu mới không khớp.");
          } else {
            await User.update(
              {
                password: await bcrypt.hash(body.newPassword, 15),
              },
              { where: { email: { [Op.iLike]: user.email } } }
            );
            await UserAgent.update(
              {
                is_logged_in: false,
              },
              { where: { id: { [Op.not]: id } } }
            );

            req.flash("success-msg", "Đổi mật khẩu thành công.");
            return res.redirect("/");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/doi-mat-khau");
  },

  async userAgent(req, res) {
    if (req.session.userSession) {
      const userAgent = req.get("user-agent");

      const userLoggedIn = req.session.userSession;

      const userAgentInfo = await UserAgent.findAll({
        where: { user_id: userLoggedIn.id },
      });

      res.render("userAgent", {
        req,
        userAgentInfo,
        userAgent,
      });
    }
    // res.render("userAgent");
  },

  async handleUserAgent(req, res, next) {
    try {
      //Set-up device-detector
      const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });
      const userAgent = req.get("user-agent");
      const result = detector.detect(userAgent);

      // Get user who logged in by session
      const userLoggedIn = req.session.userSession;

      // Get user-agent information
      const userAgentInfo = await UserAgent.findOne({
        where: { user_id: userLoggedIn.id },
      });

      // Do this if this is the first time getting user-agent information
      if (!userAgentInfo) {
        console.log("tạo tại không thấy có userAgentInfo");

        // Creating user-agent info without access_token
        await UserAgent.create({
          user_id: userLoggedIn.id,
          device_type: result.device.type,
          os_name: result.os.name,
          client_name: result.client.name,
          login_time: "now()",
          user_agent: userAgent,
          is_logged_in: true,
        });
      } else {
        // Getting dataValues
        const userAgentData = userAgentInfo.dataValues;

        // Creating new user-agent db if this is another session logging in
        if (userAgentInfo.dataValues.user_agent !== userAgentData.user_agent) {
          console.log("tạo tại không thấy trùng userAgent");

          await UserAgent.create({
            user_id: userLoggedIn.id,
            device_type: result.device.type,
            os_name: result.os.name,
            client_name: result.client.name,
            login_time: "now()",
            user_agent: userAgent,
            is_logged_in: true,
          });
        } else {
          await UserAgent.update(
            {
              login_time: "now()",
            },
            {
              where: {
                user_id: userLoggedIn.id,
              },
            }
          );
        }
      }

      // Getting user-agent if it existed in db
    } catch (e) {
      next(e);
    }
    res.redirect("/thiet-bi");
  },

  async logout(req, res, next) {
    const userAgent = req.get("user-agent");

    const cookieAccessToken = req.cookies.access_token;

    await UserAgent.update(
      {
        logout_time: "now()",
      },
      { where: { access_token: cookieAccessToken } }
    );
    await User.update(
      {
        is_logged_in: false,
      },
      { where: {} }
    );
    delete req.session.userSession;
    // res.clearCookie("access_token");

    req.flash("logout-msg", "Đăng xuất thành công.");

    return res.redirect("/dang-nhap");
  },
};
