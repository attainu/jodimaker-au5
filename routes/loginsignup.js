const express = require("express");
const router = express.Router();
var userController = require("../controllers/user");
const PasswordOtpController = require("../controllers/passwordOtpController");
var User = require("../models/userSchema");
const passport = require("passport");

router.get("/", (req, res) => {
  req.flash("error");
  let incorrectEmail
  let incorrectPassword
  if (res.locals.error) {
    if (res.locals.error.includes("Incorrect password")) {
      incorrectPassword = "Incorrect password"

    }
    if (res.locals.error.includes("Incorrect Email")) {

      incorrectEmail = "Incorrect Email"

    }
  }
  if (req.isAuthenticated()) {
    return res.redirect("profile/1");
  }
  res.render("root", {
    wrongpassword: req.query.wrongpassword,
    notRegistered: req.query.notRegistered,
    deleted: req.query.deleted,
    incorrectEmail,
    incorrectPassword
  });
});

router.post("/generateotp", PasswordOtpController.generateotp);

router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", {
    sentEmail: req.query.sentEmail,
    emailNotExists: req.query.emailNotExists
  });
});
router.post("/forgotpassword", PasswordOtpController.forgotPassword);

router.get(
  "/resetpassword/:resetHash/:email",
  PasswordOtpController.checktempSession,
  PasswordOtpController.resetPassword
);

router.post(
  "/setnewpassword",
  PasswordOtpController.checktempSession,
  PasswordOtpController.setNewPassword
);

router.use("/signup", PasswordOtpController.checkotp);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/google", passport.authenticate("google", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    User.findOne({ _id: req.session.passport.user }).then(user => {
      if (user.Signup.mobile) {
        res.redirect("/profile/1");
      } else {
        res.render("social");
      }
    });
  }
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  User.findOne({ _id: req.session.passport.user }).then(user => {
    if (user.Signup.mobile) {
      res.redirect("/profile/1");
    } else {
      res.render("social");
    }
  });
});
module.exports = router;
