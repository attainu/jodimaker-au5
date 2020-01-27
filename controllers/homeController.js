module.exports = (req, res) => {
    const User = require("../models/userSchema");

    var user;

    User.find({})
        .then(users => {
            user = users.filter(el => el._id == req.session.passport.user)[0]

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
            matches = matches.filter(el => {
                if (user.Matches.sentrequests.includes(el._id + '')) { return }

                if (user.Matches.acceptedrequests.includes(el._id + '')) { return }
                return el
            })


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
            addlastseen(agematches)
            addlastseen(age2matches)
            addlastseen(sentrequests)
            addlastseen(receivedrequests)
            addlastseen(acceptedrequests)

            res.render("home", {
                user: user,
                agematches: agematches,
                age2matches: age2matches,
                sentrequests: sentrequests,
                receivedrequests: receivedrequests,
                acceptedrequests: acceptedrequests,
                notifications: notifications

            })
            user.LastLogin = new Date()
            user.save()
                .catch(err => console.log(err))
        });
    function addlastseen(array) {

        array.map(el => {
            if (el.LastLogin) {


                var time = new Date(Date.now() - el.LastLogin.getTime())
                el.lastSeen = time.getMonth() + " months"

                if (el.lastSeen == 0 + " months") {
                    el.lastSeen = time.getDate() + " days"
                    if (el.lastSeen == 1 + " days") {
                        el.lastSeen = time.getHours() + " hours"
                        if (el.lastSeen == 0 + " hours") {

                            el.lastSeen = time.getMinutes() + " mins"
                        }

                    }
                }
                return array
            }
        })
    }


}