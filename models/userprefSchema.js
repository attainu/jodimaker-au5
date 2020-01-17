var mongoose=require("mongoose");

var userprefSchema=new mongoose.Schema({
    minage:{
        type:Number
    },
    maxage:{
        type:Number
    },
    height:{
        type:String
    },
    maritialstatus:{
        type:String
    },
    mothertongue:{
        type:String
    },
    religion:{
        type:String
    },
    diet:{
        type:String
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

    },
    education:{
        educationlevel:{
            type: String
        },
        workingwith:{
            type: String
        },
        employer:{
            type: String
        },
        salary:{
            type: Number
        }
    },
},{_id:false})
   

const Userpref = mongoose.model('userpref', userprefSchema)
module.exports = Userpref