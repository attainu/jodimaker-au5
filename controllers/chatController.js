const cryptr = require("cryptr")

var ChatController = {}

ChatController.messages =  (req, res) => {
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
}