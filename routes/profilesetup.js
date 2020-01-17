
const express = require("express")
const router = express.Router()
var userController = require('../controllers/user');
const User = require('../models/userSchema')


//protect routes
router.use("/", function (req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        res.redirect("/")
    }
})

//get routes 


router.get("/profile/1", (req, res) => {
    res.render("profile-1");
});

router.get("/profile/2", (req, res) => {
    res.render("profile-2");
});

router.get("/profile/3", (req, res) => {
    res.render("profile-3");
});

router.get("/profile/4", (req, res) => {
    res.render("profile-4");
});

///post routes


router.post("/profile/1", userController.profile1);

router.post("/profile/2", userController.profile2);

router.post("/profile/3", userController.profile3);
router.post("/profile/4", userController.profile4);
router.post("/updatePi",userController.profile)
router.post("/userpref",userController.userpref)

module.exports = router;

