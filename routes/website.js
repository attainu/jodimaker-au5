// module.exports = router

module.exports = function (io) {
    const express = require("express");
    const router = express.Router();
    const User = require("../models/userSchema");
    const multiparty = require("multiparty");
    var cloudinary = require("cloudinary").v2;
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('asdJndsakjnvlkDmasdmqwdDFnflkqw');
    const RequestController = require('../controllers/requestController')

    const matchController = require("../controllers/matchController")

    router.get("/matches", matchController.discoverMatches);

    router.get("/profile", (req, res) => {
        User.findOne({ _id: req.session.passport.user })
            .then(user => {
                console.log(user);
                res.render("profile", {
                    result: user
                });
            })
            .catch(err => console.log(err));
    });
    router.get("/search", (req, res) => {
        User.findOne({ _id: req.session.passport.user }).then(user => {
            res.render("search", {
                user: user
            });
        });
    });


    router.get("/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/");
    });

    router.post("/sendrequest", RequestController.sendrequest);

    router.get("/matchprofile", matchController.matchprofile);

    router.post("/deletenotification", RequestController.deletenotification);


    router.get("/profile", (req, res) => {
        User.findOne({ _id: req.session.passport.user })
            .then(user => {
                res.render("profile", {
                    result: user
                })
            })
            .catch(err => console.log(err))
    })
    router.get("/search", (req, res) => {
        User.findOne({ _id: req.session.passport.user })
            .then(user => {

                res.render("search", {
                    user: user
                });

            })
    })

    router.get("/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/");
    })


    router.get("/matchprofile", (req, res) => {
        var user
        User.findOne({ _id: req.session.passport.user })
            .then(newuser => {
                user = newuser
                if (req.query.id) {
                    User.findOne({ _id: req.query.id })
                        .then(matchprofile => {
                            var isMatched = matchprofile.Matches.acceptedrequests.includes(req.session.passport.user)
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
                            var sent = user.Matches.sentrequests.includes(matchprofile._id)

                            res.render("matching", {
                                user: user,
                                match: matchprofile,
                                isMatched: isMatched,
                                matchingpref: matchingpref,
                                sent: sent

                            });
                        })
                }
            })
    });


    router.get("/home", require("../controllers/homeController"));
    router.post("/deletesent", RequestController.deletesent);

    router.post("/deletereceived", RequestController.deletereceived);

    router.delete("/acceptedrequests", RequestController.deleteAcceptedrequests);

    router.post("/acceptrequest", RequestController.acceptrequest);
    router.get("/userpref", (req, res) => {
        User.findOne({ _id: req.session.passport.user }).then(user => {
            res.render("userpref", {
                user: user
            });
        });
    });

    router.post("/searchsave", matchController.searchresults);

    router.patch("/changeprofilepic", (req, res) => {
        let form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            cloudinary.uploader.upload(files.imageFile[0].path, function (
                err,
                result
            ) {
                User.updateOne(
                    { _id: req.session.passport.user },
                    { "Profile.Profile1.photo": result.secure_url }
                ).then(() => {
                    res.send("done");
                });
            });
        });
    });

    // chat
    router.post("/chat/:user_id", (req, res) => {
        var userid = req.params.user_id + "";
        User.findOne({ _id: req.session.passport.user }, function (err, result) {
            if (result.messages[userid])
                var decryptedMsgs = result.messages[userid].map(el => {
                    el.message = cryptr.decrypt(el.message)
                })
            console.log(decryptedMsgs)
            res.send({
                messages: result.messages[userid]
            });
        });
    });
    router.post("/messages", (req, res) => {
        var friendid = req.body.friend_id + "";
        User.findOne({ _id: friendid }).then(friend => {
            var property = "messages." + friendid;
            var obj = {};

            const encryptedString = cryptr.encrypt(req.body.message);

            obj[property] = {
                from: "You",
                to:
                    friend.Profile.Profile1.name.firstname +
                    friend.Profile.Profile1.name.lastname,
                message: encryptedString
            };

            User.updateOne(
                { _id: req.session.passport.user },
                { $push: obj },
                (err, result) => {
                    if (err) console.log(err);
                    var property = "messages." + req.session.passport.user;
                    var obj = {};
                    obj[property] = {
                        from:
                            friend.Profile.Profile1.name.firstname +
                            friend.Profile.Profile1.name.lastname,
                        to: "You",
                        message: encryptedString
                    };
                    User.updateOne({ _id: friendid }, { $push: obj }, (err, result) => {
                        if (err) console.log(err);

                        io.emit("message", req.session.passport.user);
                        res.send("done");
                    });
                }
            );
        });
    });


    return router;
}

