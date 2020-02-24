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

