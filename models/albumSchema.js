var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
    album : {
        type: String,
    },
},{_id:false})

const myAlbum = mongoose.model('album', albumSchema)
module.exports = myAlbum