var mongoose = require("mongoose")
const signupSchema = require("./signupSchema").schema
const profileSchema1 = require("./profile1Schema").schema
const profileSchema2 = require("./profile2Schema").schema
const profileSchema3 = require("./profile3Schema").schema
const settingsSchema = require("./settingsSchema").schema
const userprefSchema = require("./userprefSchema").schema

const userSchema = new mongoose.Schema({
    Signup: signupSchema,
    Profile: {
        Profile1: profileSchema1,
        Profile2: profileSchema2,
        Profile3: profileSchema3
    },
    Settings: settingsSchema,

    Matches: {
        sentrequests: Array,
        receivedrequests: Array,
        acceptedrequests: Array,
        pendingrequests: Array
    },
    Notifications: {
        sentrequests: {
            type: Array,
        },
        receivedrequests: {
            type: Array,
        },
        all: Array

    },
    messages: {
        type: Object,
        default: {}
    },
    Userpref: userprefSchema


})

const User = mongoose.model('user', userSchema)
module.exports = User
