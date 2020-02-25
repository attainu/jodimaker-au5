var mongoose = require("mongoose")

var socialSchema = new mongoose.Schema({
    Signup: {
        email: {
            type: String,
            required: true
        },
        facebookid: {
            type: String,
        },
        googleid: String
    }

})
const Social = mongoose.model('social', socialSchema, 'users')
module.exports = Social
