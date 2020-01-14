var multiparty = require('multiparty');
var cloudinary = require('cloudinary').v2;
var bcrypt = require("bcrypt")
//User model
const Settings = require("../models/settingsSchema.js")
const Signup = require('../models/signupSchema')
const Profile1 = require('../models/profile1Schema.js');
const Profile2 = require('../models/profile2Schema.js');
const Profile3 = require('../models/profile3Schema.js');
const User = require('../models/userSchema')

//clodinary configruation 
cloudinary.config({
    cloud_name: "dfu8kqztl",
    api_key: "412134237221151",
    api_secret: "jP6DMTkrr37WsJBL36Do7WDRa9s"
});

const UserController = {};

UserController.signup = function (req, res) {

    console.log(req.body)
    const { mobile, email } = req.body
    var password = req.body.password

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) console.log(err)
        else {
            password = hash

            const newUser = new User({})

            const newSignup = new Signup({

                email,
                password,
                mobile,
            })
            newUser.Signup = newSignup
            newUser.save()
                .then(user => {

                    res.send("okay")

                })
                .catch(err => console.log(err))
        }
    })


}

UserController.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ "Signup.email": email })
        .then(user => {
            bcrypt.compare(password, user.Signup.password, function (err, check) {

                if (err) console.log(err)
                if (check) {

                    req.session.user = { _id: user._id };
                    if (user.Profile.Profile3) {


                        res.redirect("/dashboard")
                    }
                    else {
                        res.redirect("/profile/1")
                    }
                }
                else {
                    res.redirect("/?wrongpassword=true")
                }
            })

        })
        .catch(err => console.log(err))
} 

UserController.profile1 = function (req, res) {
    var userId = req.session.user._id;
    let form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        cloudinary.uploader.upload(files.image[0].path, function (err, result) {
            var userData = {
                name: {
                    firstname: fields.firstname[0],
                    middlename: fields.middlename[0],
                    lastname: fields.lastname[0]
                },

                address: fields.address[0],
                location: {
                    country: fields.country[0],
                    state: fields.state[0],
                    city: fields.city[0]
                }
            };
            if (result) {
                userData.photo = result.secure_url
            }

            User.findOne({ _id: userId })
                .then(user => {
                    const newProfile1 = new Profile1(userData)
                    user.Profile.Profile1 = newProfile1
                    var newSettings = new Settings({ showname: fields.firstname[0][0] + " " + fields.lastname[0] })
                    user.Settings = newSettings
                    user.save()
                        .then(user => {
                            console.log("saved user profile1")
                            res.redirect("/profile/2");
                        })
                        .catch(err => console.log(err))
                })
        })

    })
}
UserController.profile2 = function (req, res) {
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
    data = {
        dob: {
            day: parseFloat(req.body.day),
            month: parseFloat(req.body.month),
            year: parseFloat(req.body.year)
        },
        age: getAge(""+parseFloat(req.body.month)+"/"+parseFloat(req.body.day)+"/"+parseFloat(req.body.year)+""),
        gender: req.body.gender,
        maritialstatus: req.body.maritialstatus,
        height: parseFloat(req.body.height),
        weight: parseFloat(req.body.weight),
        diet: req.body.diet,
        religion: req.body.religion,
        caste: req.body.caste,
        mothertongue: req.body.mothertongue,
        family: {
            status: req.body.status,
            type: req.body.type
        }
    };
    User.findOne({ _id: req.session.user._id })
        .then(user => {
            const newProfile2 = new Profile2(data)
            user.Profile.Profile2 = newProfile2
            user.save()
                .then(user => {
                    console.log("saved user profile2")
                    res.redirect("/profile/3");
                })
                .catch(err => console.log(err))
        })

}
UserController.profile3 = function (req, res) {
    data = {

        hobbies: req.body.hobbies,
        education: {
            educationlevel: req.body.educationlevel,
            isEmployed: /true/i.test(req.body.isEmployed),
        },
        drinking: req.body.drinking,
        smoking: req.body.smoking
    };
    if (data.education.isEmployed) {
        data.education.employer = req.body.employer,
            data.education.salary = parseFloat(req.body.salary)
    }
    User.findOne({ _id: req.session.user._id })
        .then(user => {
            const newProfile3 = new Profile3(data)
            user.Profile.Profile3 = newProfile3
            user.save()
                .then(user => {
                    console.log("saved user profile3")
                    res.redirect("/profile/4")

                })
                .catch(err => {
                    console.log(err)
                    res.redirect("./profile/3")
                })
        })
}

UserController.profile4 = function (req, res) {
    const AboutYourself = req.body.AboutYourself
    User.update({ _id: req.session.user._id }, { "Profile.Profile3.AboutYourself": AboutYourself })
        .then(user => {
            console.log("saved aboutyourself")
            res.redirect("/dashboard")

        })
        .catch(err => console.log(err))
}

module.exports = UserController;

