const express = require("express")
const router = express.Router()
var userController = require('../controllers/user');
const User = require('../models/userSchema')

router.get("/dashboard", (req, res) => {
    console.log(req.query);
    User.findOne({ _id: req.session.user._id }).then(user => {
        
        if(req.query.religion){
            if(req.query.isEmployed){
            User.find({"Profile.Profile3.hobbies": { $in : user.Profile.Profile3.hobbies }, "Profile.Profile2.gender" : { $ne : user.Profile.Profile2.gender }, "Profile.Profile2.age" : { $lte : req.query.age }, "Profile.Profile3.education.employed" : { $eq : req.query.isEmployed },"Profile.Profile2.religion" : { $eq : req.query.religion } }).then(matches => {
                //console.log(matches)
                
                res.render("dashboard",{
                    matches : matches,
                })}).catch(err => console.log(err))
                return
            }
            User.find({"Profile.Profile3.hobbies": { $in : user.Profile.Profile3.hobbies }, "Profile.Profile2.gender" : { $ne : user.Profile.Profile2.gender }, "Profile.Profile2.age" : { $lte : req.query.age },"Profile.Profile2.religion" : { $eq : req.query.religion } }).then(matches => {
                //console.log(matches)
                
                res.render("dashboard",{
                    matches : matches,
                })}).catch(err => console.log(err))
                return
        }
                
        User.find({"Profile.Profile3.hobbies": { $in : user.Profile.Profile3.hobbies }, "Profile.Profile2.gender" : { $ne : user.Profile.Profile2.gender } }).then(matches => {
            //console.log(matches)
            
            res.render("dashboard",{
                matches : matches,
            })}).catch(err => console.log(err))
    }).catch(err => console.log(err))
  

})

router.get("/profile", (req, res) => {
    res.render("profile");

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

module.exports = router