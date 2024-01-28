"use strict";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "082.hoangtuankiet@gmail.com",
    pass: "kbva iour ywwl qfrc",
  },
});

module.exports = {
  sendMailForm(req, res) {
    res.render("sendMail");
  },
  async handleSendMail(req, res) {
    const info = await sendMail(
      "ponysbed27@gmail.com",
      "I love you <3",
      "From Sus with love"
    );
    res.json(info);
  },
};
