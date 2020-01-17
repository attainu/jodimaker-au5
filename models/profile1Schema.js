var mongoose = require("mongoose")

var profileSchema1 = new mongoose.Schema({
    name: {
        firstname: {
            type: String,
            required: true
        },
        middlename: {
            type: String,
        }, lastname: {
            type: String,
            required: true
        }
    },
    photo: {
        type: String,
        default: "https://avpn.asia/wp-content/uploads/2015/05/empty_profile.png"
    },
    address: {
        type: String,
        required: true
    },
    location: {
        country: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        }

    }

}, { _id: false })

const Profile1 = mongoose.model('profile1', profileSchema1)
module.exports = Profile1
