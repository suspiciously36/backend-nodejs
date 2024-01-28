"use strict";

const { string } = require("yup");

const sendMail = require("../utils/mail");

module.exports = {
  sendMailForm(req, res) {
    res.render("sendMail", { req });
  },
  async handleSendMail(req, res) {
    // console.log(req);
    console.log(body.title);
    const rule = {
      sendTo: string().required(
        "Cần điền người nhận cái email này, không thì bạn tính gửi cho ma à?"
      ),
      title: string().required("Điền tiêu đề mail vào đi."),
      content: string().required(
        "Điền nội dung đi đừng gửi mail không có nội dung chứ."
      ),
    };

    const body = await req.validate(req.body, rule);
    if (body) {
      try {
        console.log(body.title);
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/gui-mail");
  },
};
