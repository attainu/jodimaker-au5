const express = require("express")
const router = express.Router()
var userController = require('../controllers/user');
var nodemailer = require("nodemailer")
var User = require("../models/userSchema")
var otp

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home")
  }
  res.render("root");
})


router.post("/generateotp", (req, res) => {
  User.findOne({ "Signup.email": req.body.email })
    .then(user => {
      if (user) {
        res.send("user exists")
      }
      else {
        otp = Math.floor(Math.random() * 10000000000) + ""
        otp = otp.slice(0, 5)
        console.log(otp)
        sendVerificationEmail(req.body.email).catch(console.error);
        res.send("otp sent")

      }
    })
    .catch(err => console.log(err))


})
router.use("/signup", (req, res, next) => {
  console.log(req.body)
  if (req.body.otp == otp) {
    next()
  } else {
    res.send("false")
  }

})

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
    html: "<b>Welcome to Jodimaker.Your Jodimaker verification code is " + otp + "</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}