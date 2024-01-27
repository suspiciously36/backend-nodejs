var express = require("express");
var router = express.Router();
const indexController = require("../controllers/index.controller");

/* GET home page. */
router.get("/", indexController.index);

router.get("/dang-xuat", indexController.logout);
router.get("/dang-xuat-all", indexController.universalLogout);
router.get("/dang-xuat-only", indexController.sessionLogout);

router.get("/dang-nhap", indexController.login);
router.post("/dang-nhap", indexController.handleLogin);

router.get("/dang-ky", indexController.register);
router.post("/dang-ky", indexController.handleRegister);

router.get("/sua-thong-tin", indexController.edit);
router.post("/sua-thong-tin", indexController.handleEdit);

router.get("/doi-mat-khau", indexController.changePassword);
router.post("/doi-mat-khau", indexController.handleChangePassword);

router.get("/thiet-bi", indexController.userAgent);
router.post("/thiet-bi", indexController.handleUserAgent);

module.exports = router;
