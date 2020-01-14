const express = require("express")
const router = express.Router()
const User = require("../models/userSchema")
var user

router.get("/matches", (req, res) => {
    User.find({})
        .then(users => {
            var matches = users.filter(el => {
                if (el.Profile.Profile2) { return el.Profile.Profile2.gender != user.Profile.Profile2.gender }
            })
            var sent = matches.map(match => {
                if (user.Matches.sentrequests.includes(match._id)) {
                    match.sent = true
                }
            })
            res.render("matches", {
                user: user,
                matches: matches
            });
        })

        .catch(err => console.log(err))
});

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

router.post("/sendrequest", (req, res) => {

    var matchid = req.body.id
    User.findOne({ _id: matchid })
        .then(match => {
            console.log(user)
            var username = user.Profile.Profile1.name
            var matchname = match.Profile.Profile1.name
            match.Matches.receivedrequests.push(req.session.user._id)
            match.Notifications.receivedrequests.push("You recieved a request from " + username.firstname + " " + username.lastname)
            match.save()
            user.Matches.sentrequests.push(matchid)
            user.Notifications.sentrequests.push("You sent a request to " + matchname.firstname + " " + matchname.lastname)
            user.save()

        })
        .catch(err => console.log("error in sending request", err))
    res.send("done")

})

router.get("/matchprofile", (req, res) => {
    res.render("matching", {

    });

})
router.get("/home", (req, res) => {

    User.find({})
        .then(users => {
            user = users.filter(el => el._id == req.session.user._id)[0]

            var matches = users.filter(el => {
                if (el.Profile.Profile2) { return el.Profile.Profile2.gender != user.Profile.Profile2.gender }
            })
            var sentrequests = matches.filter(match => {
                return user.Matches.sentrequests.includes(match._id) ? match : undefined
            })
            var receivedrequests = matches.filter(match => {
                return user.Matches.receivedrequests.includes(match._id) ? match : undefined
            })
            var notifications = []
            user.Notifications.sentrequests.forEach(el => notifications.push(el))
            user.Notifications.receivedrequests.forEach(el => notifications.push(el))

            var agematches = []
            matches.forEach(el => {
                if (agematches.length < 3) {

                    if (el.Profile.Profile2.age >= user.Profile.Profile2.age) {
                        agematches.push(el)
                    }

                }
            })
            matches = matches.filter(el => {
                return agematches.includes(el) ? undefined : el
            })
            res.render("home", {
                user: user,
                agematches: agematches,
                matches: matches,
                sentrequests: sentrequests,
                receivedrequests: receivedrequests,
                notifications: notifications

            })

        });
});


module.exports = router