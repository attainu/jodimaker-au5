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
    }
}, { _id: false })
const Profile3 = mongoose.model('profile3', profileSchema3)
module.exports = Profile3


