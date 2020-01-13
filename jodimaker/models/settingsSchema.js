var mongoose = require("mongoose")

var SettingsSchema = new mongoose.Schema({
    showname: {
        type: String,
        default: "Anonymous"
    },
    showdob: {
        type: String,
        default: "1"
    },
    showemail: {
        type: String,
        default: "0"

    },
    subscribe: {
        type: String,
        default: "0"
    },
    emailsubscribe: {
        type: String,
        default: "0"
    },
    showphone: {
        type: String,
        default: "0"
    },
    showsalary: {
        type: String,
        default: "1"
    },
    whocancontactme: {
        age1: {
            type: String,
        },
        age2: {
            type: String,
        },
        caste: {
            type: String,
        },
        religion: {
            type: String,
        },
        mothertongue: {
            type: String,
        }

    }
}, { _id: false })

const Settings = mongoose.model('settings', SettingsSchema)
module.exports = Settings
