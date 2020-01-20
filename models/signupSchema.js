var mongoose = require("mongoose")

var signupSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    createdBy:{
        type:String,
        
    }

}, { _id: false })
const Signup = mongoose.model('signup', signupSchema)
module.exports = Signup
