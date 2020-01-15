var mongoose = require("mongoose")

var profileSchema2 = new mongoose.Schema({
    dob: {
        day: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
    },
    age:{
        type:Number
    },
    gender: {
        type: String,
        required: true
    },
    mothertongue: {
        type: String,
        required: true
    },
    maritialstatus: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    diet: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    caste: {
        type: String,
    },
    family: {
        status: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }
}, { _id: false })
const Profile2 = mongoose.model('profile2', profileSchema2)
module.exports = Profile2
