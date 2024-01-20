var express = require("express");
var router = express.Router();
const indexController = require("../controllers/index.controller");

/* GET home page. */
router.get("/", indexController.index);

router.get("/dang-xuat", indexController.logout);

router.get("/dang-nhap", indexController.login);
router.post("/dang-nhap", indexController.handleLogin);

module.exports = router;
