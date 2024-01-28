"use strict";

var express = require("express");
var router = express.Router();

const path = require("path");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

const gmail = google.gmail("v1");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/test-mail", async function runSample() {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
    scopes: [
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/gmail.metadata",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });
  google.options({ auth });
  const res = await gmail.users.messages.get();
  console.log(res);
});

module.exports = router;
