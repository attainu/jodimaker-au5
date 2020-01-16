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


router.get("/dashboard", (req, res) => {
    console.log(req.query);
    User.findOne({ _id: req.session.user._id }).then(user => {

        if (req.query.religion) {
            if (req.query.isEmployed) {
                User.find({ "Profile.Profile3.hobbies": { $in: user.Profile.Profile3.hobbies }, "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender }, "Profile.Profile2.age": { $lte: req.query.age }, "Profile.Profile3.education.employed": { $eq: req.query.isEmployed }, "Profile.Profile2.religion": { $eq: req.query.religion } })
                    .then(matches => {
                        console.log(matches)

                        res.render("dashboard", {
                            matches: matches,
                        })
                    }).catch(err => console.log(err))
                return
            }
            User.find({ "Profile.Profile3.hobbies": { $in: user.Profile.Profile3.hobbies }, "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender }, "Profile.Profile2.age": { $lte: req.query.age }, "Profile.Profile2.religion": { $eq: req.query.religion } })
                .then(matches => {
                    console.log(matches)

                    res.render("dashboard", {
                        matches: matches,
                    })
                }).catch(err => console.log(err))
            return
        }

        User.find({ "Profile.Profile3.hobbies": { $in: user.Profile.Profile3.hobbies }, "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender } })
            .then(matches => {
                console.log(matches)

                res.render("dashboard", {
                    matches: matches,
                })
            }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    User.find({})
        .then(matches => {


            res.render("dashboard", {
                matches: matches,
            })
        })
        .catch(err => console.log(err))

})

router.get("/profile", (req, res) => {
    User.findOne({ _id: req.session.user._id })
        .then(user => {
            res.render("profile", {
                result: user
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

router.post("/sendrequest", (req, res) => {

    var matchid = req.body.id
    User.findOne({ _id: matchid })
        .then(match => {
            console.log(user)
            var username = user.Profile.Profile1.name
            var matchname = match.Profile.Profile1.name
            match.Matches.receivedrequests.push(req.session.user._id)
            // match.Notifications.receivedrequests.push("You recieved a request from " + username.firstname + " " + username.lastname)
            match.Notifications.all.push("You recieved a request from " + username.firstname + " " + username.lastname)
            match.save()
            user.Matches.sentrequests.push(matchid)
            // user.Notifications.sentrequests.push("You sent a request to " + matchname.firstname + " " + matchname.lastname)
            user.Notifications.all.push("You sent a request to " + matchname.firstname + " " + matchname.lastname)
            user.save()

        })
        .catch(err => console.log("error in sending request", err))
    res.send("done")

})

router.get("/matchprofile", (req, res) => {
    if (req.query.id) {
        User.findOne({ _id: req.query.id })
            .then(matchprofile => {
                var isMatched = matchprofile.Matches.acceptedrequests.includes(user._id)

                res.render("matching", {
                    user: user,
                    match: matchprofile,
                    isMatched: isMatched

                });
            })
    }
    else {
        res.send("Error 404")
    }

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
            var acceptedrequests = matches.filter(match => {
                return user.Matches.acceptedrequests.includes(match._id) ? match : undefined
            })
            var notifications = user.Notifications.all

            var agematches = []
            var age2matches = []
            matches.forEach(el => {
                if (agematches.length < 5) {

                    if (el.Profile.Profile2.age >= user.Profile.Profile2.age) {
                        agematches.push(el)
                    }
                }
                else {
                    if (age2matches.length < 5) {

                        age2matches.push(el)
                    }
                }

            })
            matches = matches.filter(el => {
                return agematches.includes(el) ? undefined : el
            })
            res.render("home", {
                user: user,
                agematches: agematches,
                age2matches: age2matches,
                sentrequests: sentrequests,
                receivedrequests: receivedrequests,
                acceptedrequests: acceptedrequests,
                notifications: notifications

            })

        });
});


router.post("/deletenotification", (req, res) => {
    var index = req.body.index
    user.Notifications.all = user.Notifications.all.filter((el, i) => i != index)
    user.save()
        .then(done => {

            User.findOne({ _id: req.session.user._id })
                .then(newuser => {
                    user = newuser
                    res.send(newuser.Notifications.all.length + "")
                })
        })

})
router.post("/deletesent", (req, res) => {
    var id = req.body.id


    user.Matches.sentrequests = user.Matches.sentrequests.filter(el => el != id)

    user.save()
        .then(done => {

            User.findOne({ _id: req.session.user._id })
                .then(newuser => {
                    user = newuser
                    res.send(newuser.Matches.sentrequests.length + "")
                })
        })

})
router.post("/deletereceived", (req, res) => {
    var id = req.body.id


    user.Matches.receivedrequests = user.Matches.receivedrequests.filter(el => el != id)

    user.save()
        .then(done => {

            User.findOne({ _id: req.session.user._id })
                .then(newuser => {
                    user = newuser
                    res.send(newuser.Matches.receivedrequests.length + "")
                })
        })

})


router.post("/acceptrequest", (req, res) => {
    var id = req.body.id
    console.log(req.body)
    User.findOne({ _id: id })
        .then(match => {
            data = { "acceptedmatch": match }
            var username = user.Profile.Profile1.name
            var matchname = match.Profile.Profile1.name
            match.Matches.sentrequests = match.Matches.sentrequests.filter(el => el != user._id)
            match.Matches.acceptedrequests.push(user._id + "")
            match.Notifications.all.push(username.firstname + " " + username.lastname + "accepted your request.")
            match.save()
            user.Matches.receivedrequests = user.Matches.receivedrequests.filter(el => el != match._id)
            user.Matches.acceptedrequests.push(match._id + "")
            user.Notifications.all.push("You accepted " + matchname.firstname + " " + matchname.lastname + "\'s request")
            user.save()
                .then(done => {

                    User.findOne({ _id: req.session.user._id })
                        .then(newuser => {
                            user = newuser
                            data.acceptedrequests = user.Matches.acceptedrequests.length
                            data.receivedrequests = user.Matches.receivedrequests.length
                            res.send(data)
                        })
                })
        })

})
router.get("/userpref",(req,res)=>{
    res.render("userpref")
})

router.post("/searchsave", (req, res) => {
    console.log(req.body)
    var ageArray = req.body.age.split("-").map(age => parseInt(age))
    var minage = ageArray[0]
    var maxage = ageArray[1]
    var { maritialstatus, religion, mothertongue, country, state, city } = req.body
    maritialstatus = maritialstatus? changetoArray(maritialstatus):undefined
    religion = religion?changetoArray(religion):undefined
    mothertongue = mothertongue?changetoArray(mothertongue):undefined
    country = country?changetoArray(country):undefined
    state = state?changetoArray(state):undefined
    city = city?changetoArray(city):undefined

    var matches
    User.find({ "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender } })
        .then(users => {
            matches = users
            matches = matches.filter(match => {
                if (user.Matches.acceptedrequests.includes(match._id))
                    return
                if (user.Matches.receivedrequests.includes(match._id))
                    return
                if (match.Profile.Profile2) {

                    if (match.Profile.Profile2.age >= minage && match.Profile.Profile2.age <= maxage) {

                        if (maritialstatus) {
                            if (!maritialstatus.includes(match.Profile.Profile2.maritialstatus)) {
                                return
                            }
                        }
                        if (religion) {
                            if (!religion.includes(match.Profile.Profile2.religion)) {
                                return
                            }
                        }
                        if (mothertongue) {
                            if (!mothertongue.includes(match.Profile.Profile2.mothertongue)) {
                                return
                            }
                        }
                        if (country) {
                            if (!country.includes(match.Profile.Profile1.location.country)) {
                                return
                            }
                        }
                        if (state) {
                            if (!state.includes(match.Profile.Profile1.location.state)) {
                                return
                            }
                        }
                        if (city) {
                            if (!city.includes(match.Profile.Profile1.location.city)) {
                                return
                            }
                        }

                        return match

                    }
                }

            })
            res.render("searchresults", {
                matches: matches
            })
        })

    function changetoArray(x) {
        if (typeof (x) != "object") {
            var y = []
            y[0] = x
            return y
        }
        else return x
    }
})

module.exports = router