"use strict";

const { string } = require("yup");
const path = require("path");
const sendMail = require("../utils/mail");

module.exports = {
  sendMailForm(req, res) {
    const options = {
      root: path.join(__dirname),
    };
    res.sendFile("img404.jpg");
    res.render("sendMail", { req });
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
