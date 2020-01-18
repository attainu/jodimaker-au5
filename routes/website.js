
// module.exports = router

module.exports = function (io) {

    const express = require("express")
    const router = express.Router()
    const User = require("../models/userSchema")
    const multiparty = require("multiparty")
    var cloudinary = require('cloudinary').v2;



    var user

    var filteredmatches

    router.get("/matches", (req, res) => {
        var { age, isEmployed, religion, height, salary } = req.query
        if (req.query.age) {

            var minage = parseInt(age.split("-")[0])
            var maxage = parseInt(age.split("-")[1])

            var minheight = parseInt(height[0]) * 12 + parseInt(height[2] + height[3])
            var maxheight = parseInt(height[8]) * 12 + parseInt(height[10] + height[11])


            var minsalary = parseInt(salary.split("-")[0])
            var maxsalary = parseInt(salary.split("-")[1])

        }
        User.find({})
            .then(users => {

                var matches = users.filter(el => {
                    if (el.Profile.Profile2) {
                        if (el.Profile.Profile2.gender == user.Profile.Profile2.gender) {
                            return
                        }
                        if (req.query.age) {
                            if (el.Profile.Profile2.age < minage || el.Profile.Profile2.age > maxage) {
                                return
                            }
                            if (religion) {

                                if (el.Profile.Profile2.religion != religion) {
                                    return
                                }
                            }
                            if (el.Profile.Profile2.salary < minsalary || el.Profile.Profile2.salary > maxsalary) {
                                return
                            }
                            var heightfeet = el.Profile.Profile2.height
                            var heightinches = parseInt(heightfeet[1]) * 12 + parseInt(heightfeet[3] + heightfeet[4])
                            if (heightinches < minheight || heightinches > maxheight) {
                                return
                            }


                        }
                        return el
                    }
                })
                matches.map(match => {
                    if (user.Matches.sentrequests.includes(match._id)) {
                        match.sent = true
                    }
                })



                res.render("matches", {
                    user: user,
                    matches: matches,
                    filter: req.query
                });
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

                res.send("done")
            })
            .catch(err => console.log("error in sending request", err))

    })

    router.get("/matchprofile", (req, res) => {
        if (req.query.id) {
            User.findOne({ _id: req.query.id })
                .then(matchprofile => {
                    var isMatched = matchprofile.Matches.acceptedrequests.includes(req.session.user._id)
                    if (matchprofile.Userpref) {
                        var matchingpref = {}

                        if (user.Profile.Profile2.age > matchprofile.Userpref.minage && user.Profile.Profile2.age < matchprofile.Userpref.maxage) {
                            matchingpref.age = matchprofile.Userpref.minage + "-" + matchprofile.Userpref.maxage
                        }
                        var heightfeet = user.Profile.Profile2.height

                        var minheight = parseInt(matchprofile.Userpref.height[1]) * 12 + parseInt(matchprofile.Userpref.height[3] + matchprofile.Userpref.height[4])
                        var heightinches = parseInt(heightfeet[1]) * 12 + parseInt(heightfeet[3] + heightfeet[4])
                        if (heightinches >= minheight) {
                            matchingpref.height = matchprofile.Userpref.height + "-" + "6'5 ft"
                        }
                        if (matchprofile.Userpref.maritialstatus == user.Profile.Profile2.maritialstatus) {
                            matchingpref.maritalstatus = matchprofile.Userpref.maritialstatus
                        }
                        if (matchprofile.Userpref.religion == user.Profile.Profile2.religion) {
                            matchingpref.religion = matchprofile.Userpref.religion
                        }
                        if (matchprofile.Userpref.mothertongue == user.Profile.Profile2.mothertongue) {
                            matchingpref.mothertongue = matchprofile.Userpref.mothertongue
                        }
                        if (matchprofile.Userpref.diet == user.Profile.Profile2.diet) {
                            matchingpref.diet = matchprofile.Userpref.diet
                        }
                        if (matchprofile.Userpref.location.country == user.Profile.Profile1.location.country) {
                            matchingpref.country = matchprofile.Userpref.location.country
                        }
                        if (matchprofile.Userpref.location.state == user.Profile.Profile1.location.state) {
                            matchingpref.state = matchprofile.Userpref.location.state
                        }
                        if (matchprofile.Userpref.location.city == user.Profile.Profile1.location.city) {
                            matchingpref.city = matchprofile.Userpref.location.city
                        }


                    }


                    res.render("matching", {
                        user: user,
                        match: matchprofile,
                        isMatched: isMatched,
                        matchingpref: matchingpref

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

    router.delete("/acceptedrequests", (req, res) => {
        var id = req.body.id


        user.Matches.acceptedrequests = user.Matches.acceptedrequests.filter(el => el != id)

        user.save()
            .then(done => {

                User.findOne({ _id: req.session.user._id })
                    .then(newuser => {
                        user = newuser
                        res.send(newuser.Matches.acceptedrequests.length + "")
                        User.findOne({ _id: id })
                            .then(unmatch => {
                                unmatch.Matches.acceptedrequests = unmatch.Matches.acceptedrequests.filter(el => el != req.session.user._id)
                                unmatch.save()
                            })
                    })
            })



    })


    router.post("/acceptrequest", (req, res) => {
        var id = req.body.id
        User.findOne({ _id: id })
            .then(match => {
                data = { "acceptedmatch": match }
                var username = user.Profile.Profile1.name
                var matchname = match.Profile.Profile1.name
                match.Matches.sentrequests = match.Matches.sentrequests.filter(el => el != req.session.user._id)
                match.Matches.acceptedrequests.push(req.session.user._id + "")
                match.Notifications.all.push(username.firstname + " " + username.lastname + " accepted your request.")
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
    router.get("/userpref", (req, res) => {
        res.render("userpref")
    })

    router.post("/searchsave", (req, res) => {
        var ageArray = req.body.age.split("-").map(age => parseInt(age))
        var minage = ageArray[0]
        var maxage = ageArray[1]
        var { maritialstatus, religion, mothertongue, country, state, city } = req.body
        maritialstatus = maritialstatus ? changetoArray(maritialstatus) : undefined
        religion = religion ? changetoArray(religion) : undefined
        mothertongue = mothertongue ? changetoArray(mothertongue) : undefined
        country = country ? changetoArray(country) : undefined
        state = state ? changetoArray(state) : undefined
        city = city ? changetoArray(city) : undefined

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

    router.patch("/changeprofilepic", (req, res) => {
        let form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            cloudinary.uploader.upload(files.imageFile[0].path, function (err, result) {
                User.updateOne({ _id: req.session.user._id }, { "Profile.Profile1.photo": result.secure_url })
                    .then(() => {
                        res.send("done")
                    })
            })
        })
    })

    // chat
    router.post("/chat/:user_id", (req, res) => {
        var userid = req.params.user_id + ''
        User.findOne({ _id: req.session.user._id }, function (err, result) {
            res.send({
                user: req.session.user,
                friend_id: userid,
                messages: result.messages[userid]
            })
        })


    })
    router.post("/messages", (req, res) => {
        var friendid = req.body.friend_id + ''
        User.findOne({ _id: friendid })
            .then(friend => {

                var property = "messages." + friendid
                var obj = {}
                obj[property] = {
                    "from": "You",
                    "to": friend.Profile.Profile1.name.firstname + friend.Profile.Profile1.name.lastname,
                    "message": req.body.message
                }

                User.updateOne({ _id: req.session.user._id }, { $push: obj }, (err, result) => {
                    if (err) console.log(err)
                    var property = "messages." + req.session.user._id
                    var obj = {}
                    obj[property] = {
                        "from": friend.Profile.Profile1.name.firstname + friend.Profile.Profile1.name.lastname,
                        "to": "You",
                        "message": req.body.message
                    }
                    User.updateOne({ _id: friendid }, { $push: obj }, (err, result) => {
                        if (err) console.log(err)

                        io.emit('message', req.session.user._id)
                        res.send("done")
                    })
                })
            })
    })
    // ...routes

    return router;
}