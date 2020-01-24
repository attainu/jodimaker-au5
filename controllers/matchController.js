

const User = require("../models/userSchema")

const matchController = {}


matchController.discoverMatches = (req, res) => {

    var { age, isEmployed, religion, height, salary } = req.query;
    if (req.query.age) {
        var minage = parseInt(age.split("-")[0]);
        var maxage = parseInt(age.split("-")[1]);

        var minheight =
            parseInt(height[0]) * 12 + parseInt(height[2] + height[3]);
        var maxheight =
            parseInt(height[8]) * 12 + parseInt(height[10] + height[11]);

        // var minsalary = parseInt(salary.split("-")[0]);
        // var maxsalary = parseInt(salary.split("-")[1]);
    }
    var user
    User.findOne({ _id: req.session.user._id })
        .then(newuser => {
            user = newuser
            User.find({})
                .then(users => {
                    var matches = users.filter(el => {
                        if (el.Profile.Profile2) {
                            if (el.Profile.Profile2.gender == user.Profile.Profile2.gender) {
                                return;
                            }
                            if (el.Matches.acceptedrequests.includes(user._id)) {
                                return
                            }


                            if (req.query.age) {
                                if (
                                    el.Profile.Profile2.age < minage ||
                                    el.Profile.Profile2.age > maxage
                                ) {
                                    return;
                                }
                                if (religion) {
                                    if (el.Profile.Profile2.religion != religion) {
                                        return;
                                    }
                                }
                                // if (
                                //   el.Profile.Profile2.salary < minsalary ||
                                //   el.Profile.Profile2.salary > maxsalary
                                // ) {
                                //   return;
                                // }
                                var heightfeet = el.Profile.Profile2.height;
                                var heightinches =
                                    parseInt(heightfeet[1]) * 12 +
                                    parseInt(heightfeet[3] + heightfeet[4]);
                                if (heightinches < minheight || heightinches > maxheight) {
                                    return;
                                }
                            }
                            return el;
                        }

                    });
                    matches.map(match => {
                        if (user.Matches.sentrequests.includes(match._id)) {
                            match.sent = true;
                        }
                        if (user.Matches.acceptedrequests.includes(match._id)) {
                            match.isMatched = true
                        }
                    });
                    var userPrefMatches = []
                    matches = matches.filter(matchprofile => {
                        if (user.Userpref) {
                            if (
                                matchprofile.Profile.Profile2.age < user.Userpref.minage ||
                                matchprofile.Profile.Profile2.age > user.Userpref.maxage
                            ) {
                                console.log(1)
                                return matchprofile
                            }
                            var heightfeet = matchprofile.Profile.Profile2.height;

                            var minheight =
                                parseInt(user.Userpref.height[1]) * 12 +
                                parseInt(
                                    user.Userpref.height[3] + user.Userpref.height[4]
                                );
                            var heightinches =
                                parseInt(heightfeet[1]) * 12 +
                                parseInt(heightfeet[3] + heightfeet[4]);
                            if (heightinches <= minheight) {
                                console.log(2)

                                return matchprofile
                            }
                            if (
                                user.Userpref.maritialstatus !=
                                matchprofile.Profile.Profile2.maritialstatus && user.Userpref.maritialstatus != "doesnotmatter"
                            ) {
                                console.log(3)
                                return matchprofile
                            }
                            if (
                                user.Userpref.religion != matchprofile.Profile.Profile2.religion && user.Userpref.religion != "doesnotmatter"
                            ) {
                                console.log(3)

                                return matchprofile
                            }
                            if (
                                user.Userpref.mothertongue !=
                                matchprofile.Profile.Profile2.mothertongue && user.Userpref.mothertongue != "doesnotmatter"
                            ) {
                                console.log(4)
                                return matchprofile
                            }
                            if (user.Userpref.diet != matchprofile.Profile.Profile2.diet && user.Userpref.diet != "doesnotmatter") {
                                console.log(5)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.country !=
                                matchprofile.Profile.Profile1.location.country && user.Userpref.location.country != ""
                            ) {
                                console.log(6)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.state !=
                                matchprofile.Profile.Profile1.location.state && user.Userpref.location.state != ""
                            ) {
                                console.log(7)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.city !=
                                matchprofile.Profile.Profile1.location.city && user.Userpref.location.city != ""
                            ) {
                                console.log(8)
                                return matchprofile
                            }
                            userPrefMatches.push(matchprofile)
                        }
                        else {
                            return matchprofile
                        }
                    })

                    res.render("matches", {
                        user: user,
                        matches: matches,
                        userPrefMatches: userPrefMatches,
                        filter: req.query
                    });
                })
        })
        .catch(err => console.log(err));
}
module.exports = matchController