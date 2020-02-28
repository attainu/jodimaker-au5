var bcrypt = require("bcrypt");
var User = require("../models/userSchema");
const nodemailer = require('nodemailer')
var passwordResetHash;
var cryptoRandomString = require("crypto-random-string");
var otp = {};
var tempsession = {};


var PasswordOtpController = {}

PasswordOtpController.forgotPassword = (req, res) => {
    var email = req.body.email;

    User.findOne({ "Signup.email": email }).then(user => {
        if (user) {
            passwordResetHash = user.Signup.password + "";
            bcrypt.hash(passwordResetHash, 10, function (err, hash) {
                if (err) console.log(err);
                else {
                    hash = encodeURIComponent(hash);
                    hash = hash.replace(".", "%2E");
                    passwordReset(email, hash);
                    tempsession[user.Signup.email] = cryptoRandomString({ length: 10 });
                    req.session.password = tempsession[user.Signup.email];
                    res.redirect("forgotpassword?sentEmail=true");
                }
            });
        } else {
            res.redirect("forgotpassword?emailNotExists=true");
        }
    });
}
PasswordOtpController.resetPassword = (req, res) => {
    var resetHash = req.params.resetHash.replace("%2E", ".");
    resetHash = decodeURIComponent(resetHash);
    var email = req.params.email;
    User.findOne({ "Signup.email": email }).then(user => {
        var password = user.Signup.password;
        bcrypt.compare(password, resetHash, function (err, check) {
            if (err) console.log(err);
            if (check) {
                res.render("resetpassword", {
                    user: user.Signup.email
                });
            }
        });
    });
}
PasswordOtpController.setNewPassword = (req, res) => {
    User.findOne({ "Signup.email": req.body.email }).then(user => {
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
}
PasswordOtpController.generateotp = (req, res) => {
    User.findOne({ "Signup.email": req.body.email })
        .then(user => {
            if (user) {
                res.send("user exists");
            } else {
                var userOtp = Math.floor(Math.random() * 10000000000) + "";
                userOtp = userOtp.slice(0, 5);
                req.session.otpid = cryptoRandomString({ length: 10 })
                otp[req.session.otpid] = userOtp
                console.log(userOtp);
                sendVerificationEmail(req.body.email,req.session.otpid).catch(console.error);
                res.send("otp sent");
            }
        })
        .catch(err => console.log(err));
}
PasswordOtpController.checkotp = (req, res, next) => {
    if (req.body.otp == otp[req.session.otpid]) {
        req.session.destroy()
        next();
    } else {
        res.send("false");
    }
}
PasswordOtpController.checktempSession = (req, res, next) => {
    var email = req.body.email || req.params.email
    if (req.session.password != tempsession[email] || tempsession[email] == undefined) {
        res.redirect("/");
    } else {
        next();
    }
}
module.exports = PasswordOtpController

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
            "<b>Click on this link to reset your password https://jodimaker.herokuapp.com/resetpassword/" +
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

async function sendVerificationEmail(email,id) {
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
        text: "" + otp[id], // plain text body
        html:
            "<b>Welcome to Jodimaker.Your Jodimaker verification code is " +
            otp[id] +
            "</b>" // html body
    });
}


