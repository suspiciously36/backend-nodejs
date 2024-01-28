"use strict";

const { string } = require("yup");

const sendMail = require("../utils/mail");

module.exports = {
  sendMailForm(req, res) {
    res.render("sendMail");
  },
  async handleSendMail(req, res) {
    const rule = {
      sendTo: string().required("Cần điền người nhận cái email này."),
    };
    const info = await sendMail(
      "ponysbed27@gmail.com",
      "I love you <3",
      "From Sus with love"
    );
    res.json(info);
  },
};
