const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require('bcrypt')
const User = require('../models/userSchema')
const Social = require("../models/socialSchema")
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            User.findOne({ "Signup.email": email })
                .then(user => {
                    if (!user) {

                        return done(null, false)
                    }
                    //Match Password
                    bcrypt.compare(password, user.Signup.password, function (err, check) {
                        if (err) console.log(err);
                        if (check) {

                            return done(null, user)

                        } else {
                            return done(null, false, { message: "Incorrect password" })
                        }
                    });
                })
                .catch(err => console.log(err));

        })
    )
    passport.use(new FacebookStrategy({
        clientID: "1066146250384367",
        clientSecret: "23246edc2fb5dc780ed6ef0aa82913e9",
        callbackURL: "http://localhost:3000/facebook/callback",
        profileFields: ['email'] // email should be in the scope.
    }, function (accessToken, refreshToken, profile, cb) {
        User.findOne({ "Signup.email": profile.emails[0].value })
            .then(user => {
                console.log(profile)
                //if user is not registered
                if (!user) {
                    const newUser = new Social({});
                    newUser.Signup.email = profile.emails[0].value;
                    newUser.Signup.facebookid = profile.id
                    newUser
                        .save()
                        .then(user => {
                            cb(null, user)
                        })
                        .catch(err => console.log(err))
                }
                else {
                    cb(null, user)
                }
            })
    })
    )
    passport.use(new GoogleStrategy({
        clientID: "383765522062-7lquhb0npan20iv0iscv2qqcgp51hrp5.apps.googleusercontent.com",
        clientSecret: "cyoB9Q0bih30mJUFWBnmsKAp",
        callbackURL: "http://localhost:3000/google/callback"
    }, (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
        User.findOne({ "Signup.email": profile.emails[0].value })
            .then(user => {

                //if user is not registered
                if (!user) {
                    const newUser = new Social({});
                    newUser.Signup.email = profile.emails[0].value;
                    newUser.Signup.googleid = profile.id
                    newUser
                        .save()
                        .then(user => {
                            cb(null, user)
                        })
                        .catch(err => console.log(err))
                }
                else {
                    cb(null, user)
                }
            })

    })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}