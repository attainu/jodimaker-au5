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
    },
    address: {
        type: String,
        required: true
    },
    location: {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }

    }
},{ _id: false })

const Profile1 = mongoose.model('profile1', profileSchema1)
module.exports = Profile1
