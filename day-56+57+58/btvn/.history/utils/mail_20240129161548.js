"use strict";
const nodemailer = require("nodemailer");
const path = require("path");

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

module.exports = async (to, subject, msg) => {
  const info = await transporter.sendMail({
    from: '"F8 Education 👻" <082.hoangtuankiet@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html: msg + '<img src="http://localhost:3000/pixel-tracking" alt="" />',
    attachments: [
      {
        // filename: "img404.jpg",
        path: "http://localhost:3000/pixel-tracking",
        // cid: "image",
      },
    ], // html body
  });
  return info;
};
