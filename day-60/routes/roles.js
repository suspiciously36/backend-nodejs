var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role/role.controller");
// const permission = require("../middlewares/permission.middleware");

router.get("/", roleController.index);
router.get("/add", roleController.add);
router.post("/add", roleController.handleAdd);
// router.get("/", permission("roles.read"), roleController.index);
// router.get("/add", permission("roles.create"), roleController.add);
// router.post("/add", permission("roles.create"), roleController.handleAdd);
// router.get("/edit/:id", permission("roles.update"), roleController.edit);
// router.post("/edit/:id", permission("roles.update"), roleController.handleEdit);
// router.post("/delete/:id", permission("roles.delete"), roleController.delete);

module.exports = router;
