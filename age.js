const mongoose = require("mongoose")
const User = require("./models/userSchema")
mongoose
    .connect(require("./config/keys").MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Mongodb connected...."))
    .catch(err => console.log(err));

User.find({}, function (err, users) {
    users.map(el => {
        var user = el
        if (user.messages) {
            user.messages = undefined
            user.Notifications.all = undefined
            user.Matches.receivedrequests = undefined
            user.Matches.sentrequests = undefined
            user.Matches.acceptedrequests = undefined
            user.save()
        }
    })
})

function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    return age;
}