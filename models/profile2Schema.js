var mongoose = require("mongoose")

var profileSchema2 = new mongoose.Schema({
    age:Number,
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
        type: String,
        required: true
    },
    weight: {
        type: String,
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
            default:"Rich"
        },
        type: {
            type: String,
            default: "Joint"
        }
    }
}, { _id: false })
const Profile2 = mongoose.model('profile2', profileSchema2)
module.exports = Profile2
