const express = require("express")
const router = express.Router()
const User = require("../models/userSchema")
const Settings = require("../models/settingsSchema")

router.get('/setting', function (req, res) {
    //render saved settings
    User.findOne({ _id: req.session.user._id })
        .then(user => {
            res.render("settings", {
                result: user
            })
        })
        .catch(err => console.log(err))
});


router.post("/setting2", (req, res) => {
    var obj = {}
    if (req.body.emailsubscribe) {
        obj.Settings = {

            emailsubscribe: req.body.emailsubscribe
        }
        User.updateOne({ _id: req.session.user._id }, obj)
            .then(user => {
                console.log(user)
                res.redirect("/setting")

            })
            .catch(err => console.log(err))
    }
})
router.post("/setting3", (req, res) => {
    console.log(req.body)

    var obj = { Settings: {} }

    if (req.body.showname) {
        obj.Settings.showname = req.body.showname
    }
    if (req.body.showemail) {
        obj.Settings.showemail = req.body.showemail
    }
    if (req.body.showphone) {
        obj.Settings.showphone = req.body.showphone
    }
    if (req.body.showsalary) {
        obj.Settings.showsalary = req.body.showsalary
    }
    if (req.body.showdob) {
        obj.Settings.showdob = req.body.showdob
    }
    if (req.body.subscribe) {
        obj.Settings.subscribe = req.body.subscribe
    }
    console.log(obj)
    User.updateOne({ _id: req.session.user._id }, obj)
        .then(user => {
            User.findOne({ _id: req.session.user._id })
                .then(user => res.send(user.Settings))
                .catch(err => console.log(err))
            console.log("User settings updated")
        })
        .catch(err => {
            console.log(err)
            // res.send("done")
        })


})

router.post('/update', function (req, res) {
    var data = {
        Settings: {
            whocancontactme: {

                age1: req.body.age1,
                age2: req.body.age2,
                religion: req.body.religion,
                caste: req.body.caste,
                mothertongue: req.body.mothertongue,
                maritialstatus: req.body.maritialstatus
            }
        }
    }
    User.updateOne({ _id: req.session.user._id }, data)
    res.redirect("/setting")

})

router.delete('/delete', (req, res) => {
    console.log(req.body)
    User.deleteOne({ _id: req.session.user._id })
        .then(result =>
            res.send("deleted"))
        .catch(err => {
            console.log(err)
            // res.send(err)
        })



})

module.exports = router