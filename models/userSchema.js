var mongoose = require("mongoose")
const signupSchema = require("./signupSchema").schema
const profileSchema1 = require("./profile1Schema").schema
const profileSchema2 = require("./profile2Schema").schema
const profileSchema3 = require("./profile3Schema").schema
const settingsSchema = require("./settingsSchema").schema

const userSchema = new mongoose.Schema({
    Signup: signupSchema,
    Profile: {
        Profile1: profileSchema1,
        Profile2: profileSchema2,
        Profile3: profileSchema3
    },
    Settings: settingsSchema


})

const User = mongoose.model('user', userSchema)
module.exports = User
