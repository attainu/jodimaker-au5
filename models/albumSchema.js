var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
    album : {
        type: Array,
    },
},{_id:false})

const myAlbum = mongoose.model('myAlbum', albumSchema)
module.exports = myAlbum