"use strict";

const { string } = require("yup");
const path = require("path");
const sendMail = require("../utils/mail");

module.exports = {
  sendMailForm(req, res) {
    res.render("sendMail", { req });
  },
  handlePixelTracking(req, res) {
    const options = {
      root: __dirname,
    };
    res.sendFile("public/pixel.png", options, (err) => {
      if (err) {
        console.log(`there's an err: ${err}`);
      } else {
        console.log(`file sent: at ${new Date()}`);
      }
    });
  },
  async handleSendMail(req, res, next) {
    // console.log(req);
    const rule = {
      sendTo: string().required(
        "Cần điền người nhận cái email này, không thì bạn tính gửi cho ma à?"
      ),
      title: string().required("Điền tiêu đề mail vào đi."),
      content: string().required(
        "Điền nội dung đi đừng gửi mail không có nội dung chứ."
      ),
    };
    console.log(req.body.title);

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const info = await sendMail(body.sendTo, body.title, body.content);
        return res.json(info);
      } catch (e) {
        return next(e);
      }
    }
    // return res.redirect("/gui-mail");
  },
};
