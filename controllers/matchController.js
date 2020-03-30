

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
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            User.find({
                "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender },
                $and: [{ _id: { $nin: user.Matches.acceptedrequests } }, { _id: { $nin: user.Matches.receivedrequests } }],
                // "Profile.Profile2.religion": religion

            })
                .then(users => {
                    var matches = users.filter(el => {
                        if (el.Profile.Profile2) {

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
                                // console.log(1)
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
                                // console.log(2)

                                return matchprofile
                            }
                            if (
                                user.Userpref.maritialstatus !=
                                matchprofile.Profile.Profile2.maritialstatus && user.Userpref.maritialstatus != "doesnotmatter"
                            ) {
                                // console.log(3)
                                return matchprofile
                            }
                            if (
                                user.Userpref.religion != matchprofile.Profile.Profile2.religion && user.Userpref.religion != "doesnotmatter"
                            ) {
                                // console.log(3)

                                return matchprofile
                            }
                            if (
                                user.Userpref.mothertongue !=
                                matchprofile.Profile.Profile2.mothertongue && user.Userpref.mothertongue != "doesnotmatter"
                            ) {
                                // console.log(4)
                                return matchprofile
                            }
                            if (user.Userpref.diet != matchprofile.Profile.Profile2.diet && user.Userpref.diet != "doesnotmatter") {
                                // console.log(5)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.country !=
                                matchprofile.Profile.Profile1.location.country && user.Userpref.location.country != ""
                            ) {
                                // console.log(6)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.state !=
                                matchprofile.Profile.Profile1.location.state && user.Userpref.location.state != ""
                            ) {
                                // console.log(7)
                                return matchprofile
                            }
                            if (
                                user.Userpref.location.city !=
                                matchprofile.Profile.Profile1.location.city && user.Userpref.location.city != ""
                            ) {
                                // console.log(8)
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

matchController.searchresults = (req, res) => {
    var user = ''
    var id = req.session.passport.user + ''
    User.findOne({ _id: id })
        .then(user => {

            var ageArray = req.body.age.split("-").map(age => parseInt(age));
            var minage = ageArray[0];
            var maxage = ageArray[1];
            var {
                maritialstatus,
                religion,
                mothertongue,
                country,
                state,
                city
            } = req.body;
            maritialstatus = maritialstatus ? changetoArray(maritialstatus) : undefined;
            religion = religion ? changetoArray(religion) : undefined;
            mothertongue = mothertongue ? changetoArray(mothertongue) : undefined;
            country = country ? changetoArray(country) : undefined;
            state = state ? changetoArray(state) : undefined;
            city = city ? changetoArray(city) : undefined;

            var matches;
            User.find({
                "Profile.Profile2.gender": { $ne: user.Profile.Profile2.gender }
            }).then(users => {
                matches = users;
                matches = matches.filter(match => {
                    if (user.Matches.acceptedrequests.includes(match._id)) return;
                    if (user.Matches.receivedrequests.includes(match._id)) return;
                    if (match.Profile.Profile2) {
                        if (
                            match.Profile.Profile2.age >= minage &&
                            match.Profile.Profile2.age <= maxage
                        ) {
                            if (maritialstatus) {
                                if (
                                    !maritialstatus.includes(match.Profile.Profile2.maritialstatus)
                                ) {
                                    return;
                                }
                            }
                            if (religion) {
                                if (!religion.includes(match.Profile.Profile2.religion)) {
                                    return;
                                }
                            }
                            if (mothertongue) {
                                if (!mothertongue.includes(match.Profile.Profile2.mothertongue)) {
                                    return;
                                }
                            }
                            if (country) {
                                if (!country.includes(match.Profile.Profile1.location.country)) {
                                    return;
                                }
                            }
                            if (state) {
                                if (!state.includes(match.Profile.Profile1.location.state)) {
                                    return;
                                }
                            }
                            if (city) {
                                if (!city.includes(match.Profile.Profile1.location.city)) {
                                    return;
                                }
                            }

                            return match;
                        }
                    }
                });

                res.render("searchresults", {
                    matches: matches,
                    user: user
                });
            })
        });

    function changetoArray(x) {
        if (typeof x != "object") {
            var y = [];
            y[0] = x;
            return y;
        } else return x;
    }
}

matchController.matchprofile = (req, res) => {
    var user
    User.findOne({ _id: req.session.passport.user })
        .then(newuser => {
            user = newuser
            if (req.query.id) {
                User.findOne({ _id: req.query.id }).then(matchprofile => {
                    var isMatched = matchprofile.Matches.acceptedrequests.includes(
                        req.session.passport.user
                    );
                    var sent = matchprofile.Matches.receivedrequests.includes(
                        req.session.passport.user
                    );

                    if (matchprofile.Userpref) {
                        var matchingpref = {};

                        if (
                            user.Profile.Profile2.age > matchprofile.Userpref.minage &&
                            user.Profile.Profile2.age < matchprofile.Userpref.maxage
                        ) {
                            matchingpref.age =
                                matchprofile.Userpref.minage + "-" + matchprofile.Userpref.maxage;
                        }
                        var heightfeet = user.Profile.Profile2.height;

                        var minheight =
                            parseInt(matchprofile.Userpref.height[1]) * 12 +
                            parseInt(
                                matchprofile.Userpref.height[3] + matchprofile.Userpref.height[4]
                            );
                        var heightinches =
                            parseInt(heightfeet[1]) * 12 +
                            parseInt(heightfeet[3] + heightfeet[4]);
                        if (heightinches >= minheight) {
                            matchingpref.height = matchprofile.Userpref.height + "-" + "6'5 ft";
                        }
                        if (
                            matchprofile.Userpref.maritialstatus ==
                            user.Profile.Profile2.maritialstatus
                        ) {
                            matchingpref.maritalstatus = matchprofile.Userpref.maritialstatus;
                        }
                        if (
                            matchprofile.Userpref.religion == user.Profile.Profile2.religion
                        ) {
                            matchingpref.religion = matchprofile.Userpref.religion;
                        }
                        if (
                            matchprofile.Userpref.mothertongue ==
                            user.Profile.Profile2.mothertongue
                        ) {
                            matchingpref.mothertongue = matchprofile.Userpref.mothertongue;
                        }
                        if (matchprofile.Userpref.diet == user.Profile.Profile2.diet) {
                            matchingpref.diet = matchprofile.Userpref.diet;
                        }
                        if (
                            matchprofile.Userpref.location.country ==
                            user.Profile.Profile1.location.country
                        ) {
                            matchingpref.country = matchprofile.Userpref.location.country;
                        }
                        if (
                            matchprofile.Userpref.location.state ==
                            user.Profile.Profile1.location.state
                        ) {
                            matchingpref.state = matchprofile.Userpref.location.state;
                        }
                        if (
                            matchprofile.Userpref.location.city ==
                            user.Profile.Profile1.location.city
                        ) {
                            matchingpref.city = matchprofile.Userpref.location.city;
                        }
                    }


                    res.render("matching", {
                        user: user,
                        match: matchprofile,
                        isMatched: isMatched,
                        matchingpref: matchingpref,
                        sent: sent,
                    });
                });
            } else {
                res.send("Error 404");
            }
        })
}
module.exports = matchController