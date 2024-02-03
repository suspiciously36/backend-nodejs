var express = require("express");
const authController = require("../controllers/auth/auth.controller");
var router = express.Router();
const passport = require("passport");

router.get("/login", authController.login);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/",
    failureFlash: true,
    badRequestMessage: "Please enter Email and Password.",
  })
);
router.get("/logout", (req, res) => {
  req.logout((error) => {
    if (!error) {
      return res.redirect("/auth/login");
    }
  });
});
router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: true,
    failureRedirect: "/auth/login",
    successRedirect: "/",
  })
);

router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password", authController.handleForgotPassword);

router.get("/reset-password", authController.resetPassword);
router.post("/reset-password", authController.handleResetPassword);

module.exports = router;
