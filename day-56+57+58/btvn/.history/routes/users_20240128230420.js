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


module.exports = router;
