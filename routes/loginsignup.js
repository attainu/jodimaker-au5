const express = require("express");
const router = express.Router();
var userController = require("../controllers/user");
var nodemailer = require("nodemailer");
var User = require("../models/userSchema");
var bcrypt = require("bcrypt");
var passwordResetHash;
var otp;
var cryptoRandomString = require("crypto-random-string");
var tempsession;

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  }
  res.render("root");
});

router.post("/generateotp", (req, res) => {
  User.findOne({ "Signup.email": req.body.email })
    .then(user => {
      if (user) {
        res.send("user exists");
      } else {
        otp = Math.floor(Math.random() * 10000000000) + "";
        otp = otp.slice(0, 5);
        console.log(otp);
        sendVerificationEmail(req.body.email).catch(console.error);
        res.send("otp sent");
      }
    })
    .catch(err => console.log(err));
});

router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", {
    sentEmail: req.query.sentEmail,
    emailNotExists: req.query.emailNotExists
  });
});
router.post("/forgotpassword", (req, res) => {
  var email = req.body.email

  User.findOne({ "Signup.email": email }).then(user => {
    if (user) {
      passwordResetHash = user.Signup.password + "";
      bcrypt.hash(passwordResetHash, 10, function (err, hash) {
        if (err) console.log(err);
        else {
          console.log(hash);
          hash = encodeURIComponent(hash);
          hash = hash.replace(".", "%2E");
          passwordReset(email, hash);
          tempsession = cryptoRandomString({ length: 10 });
          req.session.password = tempsession;
          console.log("session set", tempsession);
          res.redirect("forgotpassword?sentEmail=true");
        }
      });
    } else {
      res.redirect("forgotpassword?emailNotExists=true");
    }
  });
});
router.get("/resetpassword/:resetHash/:email", checktempSession, (req, res) => {
  var resetHash = req.params.resetHash.replace("%2E", ".");
  resetHash = decodeURIComponent(resetHash);
  var email = req.params.email;
  console.log(email)
  User.findOne({ "Signup.email": email })
    .then(user => {
      var password = user.Signup.password;
      bcrypt.compare(password, resetHash, function (err, check) {
        if (err) console.log(err);
        if (check) {
          res.render("resetpassword", {
            user: user._id
          });
        }
      });
    });
});
router.post("/setnewpassword", checktempSession, (req, res) => {
  console.log(req.body);
  User.findOne({ _id: req.body.id }).then(user => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) console.log(err);
      else {
        user.Signup.password = hash;
        user.save();
        req.session.destroy();
        res.redirect("/");
      }
    });
  });
});

router.use("/signup", (req, res, next) => {
  if (req.body.otp == otp) {
    next();
  } else {
    res.send("false");
  }
});

router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;

async function sendVerificationEmail(email) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jodimaker.official@gmail.com",
      pass: "ctswrvyyqdrrpukx"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "jodimaker.official@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Verification ✔", // Subject line
    text: "" + otp, // plain text body
    html:
      "<b>Welcome to Jodimaker.Your Jodimaker verification code is " +
      otp +
      "</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function passwordReset(email, hash) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jodimaker.official@gmail.com",
      pass: "ctswrvyyqdrrpukx"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "jodimaker.official@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Password Reset ", // Subject line
    text: "" + otp, // plain text body
    html:
      "<b>Click on this link to reset your password http://localhost:3000/resetpassword/" +
      hash +
      "/" +
      email +
      "</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

function checktempSession(req, res, next) {
  if (req.session.password != tempsession || tempsession == undefined) {
    res.redirect("/");
  } else {
    console.log(req.session.password);
    next();
  }
}
