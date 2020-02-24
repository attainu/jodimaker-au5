var RequestController = {}
const User = require("../models/userSchema")
RequestController.sendrequest = (req, res) => {
    var matchid = req.body.id;
    var user;
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            User.findOne({ _id: matchid })
                .then(match => {
                    var username = user.Profile.Profile1.name;
                    var matchname = match.Profile.Profile1.name;
                    match.Matches.receivedrequests.push(req.session.passport.user);
                    // match.Notifications.receivedrequests.push("You recieved a request from " + username.firstname + " " + username.lastname)
                    match.Notifications.all.push(
                        "You recieved a request from " +
                        username.firstname +
                        " " +
                        username.lastname
                    );
                    match.save();
                    user.Matches.sentrequests.push(matchid);
                    // user.Notifications.sentrequests.push("You sent a request to " + matchname.firstname + " " + matchname.lastname)
                    user.Notifications.all.push(
                        "You sent a request to " +
                        matchname.firstname +
                        " " +
                        matchname.lastname
                    );
                    user.save();

                    res.send("done");
                })
        })
        .catch(err => console.log("error in sending request", err));
}
RequestController.deletenotification = (req, res) => {
    User.findOne({ _id: req.session.passport.user })
        .then(user => {

            var index = req.body.index;
            user.Notifications.all = user.Notifications.all.filter(
                (el, i) => i != index
            );
            user.save().then(done => {
                User.findOne({ _id: req.session.passport.user }).then(newuser => {
                    user = newuser;
                    res.send(newuser.Notifications.all.length + "");
                });
            })
        });

}

RequestController.deletesent = (req, res) => {
    var id = req.body.id;
    var user
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            user.Matches.sentrequests = user.Matches.sentrequests.filter(
                el => el != id
            );

            user.save().then(done => {
                User.findOne({ _id: req.session.passport.user }).then(newuser => {
                    user = newuser;
                    res.send(newuser.Matches.sentrequests.length + "");
                });
            })
        });
}
RequestController.deletereceived = (req, res) => {
    var id = req.body.id;
    var user
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser

            user.Matches.receivedrequests = user.Matches.receivedrequests.filter(
                el => el != id
            );
            user.save().then(done => {
                User.findOne({ _id: req.session.passport.user }).then(newuser => {
                    user = newuser;
                    res.send(newuser.Matches.receivedrequests.length + "");
                });
            });
        })
}
RequestController.deleteAcceptedrequests = (req, res) => {
    var id = req.body.id;
    var user
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            user.Matches.acceptedrequests = user.Matches.acceptedrequests.filter(
                el => el != id
            );

            user.save().then(done => {
                User.findOne({ _id: req.session.passport.user }).then(newuser => {
                    user = newuser;
                    res.send(newuser.Matches.acceptedrequests.length + "");
                    User.findOne({ _id: id }).then(unmatch => {
                        unmatch.Matches.acceptedrequests = unmatch.Matches.acceptedrequests.filter(
                            el => el != req.session.passport.user
                        );
                        unmatch.save();
                    });
                });
            })
        });
}
RequestController.acceptrequest = (req, res) => {
    var id = req.body.id;
    var user
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            User.findOne({ _id: id }).then(match => {
                data = { acceptedmatch: match };
                var username = user.Profile.Profile1.name;
                var matchname = match.Profile.Profile1.name;
                match.Matches.sentrequests = match.Matches.sentrequests.filter(
                    el => el != req.session.passport.user
                );
                match.Matches.acceptedrequests.push(req.session.passport.user + "");
                match.Notifications.all.push(
                    username.firstname +
                    " " +
                    username.lastname +
                    "  accepted your request."
                );
                match.save();
                user.Matches.receivedrequests = user.Matches.receivedrequests.filter(
                    el => el != match._id
                );
                user.Matches.acceptedrequests.push(match._id + "");
                user.Notifications.all.push(
                    "You accepted " +
                    matchname.firstname +
                    " " +
                    matchname.lastname +
                    "'s request"
                );
                user.save().then(done => {
                    User.findOne({ _id: req.session.passport.user }).then(newuser => {
                        user = newuser;
                        data.acceptedrequests = user.Matches.acceptedrequests.length;
                        data.receivedrequests = user.Matches.receivedrequests.length;
                        res.send(data);
                    });
                });
            })
        });
}
module.exports = RequestController