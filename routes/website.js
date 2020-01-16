const express = require("express")
const router = express.Router()
const User = require('../models/userSchema')

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.get("/profile", (req, res) => {
    User.findOne({_id: req.session.user._id })
    .then(user=>{
        res.render("profile",{
            result:user
        })
    })
    .catch(err => console.log(err))
})
router.get("/search", (req, res) => {
    res.render("search");

})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})
router.get("/matchprofile", (req, res) => {
    res.render("matching");

})
router.get("/userpref",(req,res)=>{
    res.render("userpref")
})



module.exports = router