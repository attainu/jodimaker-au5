var mongoose = require("mongoose")

var profileSchema3 = new mongoose.Schema({

    hobbies: Array,
    education: {
        educationlevel: {
            type: String,
            required: true
        },
        isEmployed: {
            type: Boolean,
            default: true
        },
        employer: {
            type: String,
            default: null
        },
        salary: {
            type: String,
            default: 0
        }
    },
    drinking: {
        type: String,
        required: true
    },
    smoking: {
        type: String,
        required: true
    },

    AboutYourself: {
        type: String,
    },
    sunshine:String,
    personalvalues:String,
    bloodgroup:String,
    healthinfo:String,
    disability:String,
    fluent:String,
    subcaste:String,
    gothra:String,
    rashi:String,
    manglik:String,
    birthcity:String,
    fatherstatus:String,
    motherstatus:String,
    familylocation:String,
    nativeplace:String,
    siblings:String,
    familyvalues:String,
    profession:String,
    workingsector:String,
    interests:String,
    favoritemusic:String,
    favoritereads:String,
    preferredmovies:String,
    favoritecuisions:String,
    sportactivities:String

    
}, { _id: false })
const Profile3 = mongoose.model('profile3', profileSchema3)
module.exports = Profile3


