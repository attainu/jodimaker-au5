//global variables
var PORT = process.env.PORT || 3000;
//DB config
const db = require('./config/keys').MongoURI

var user_dataId;
//Using npm packages
var express = require('express');
var hbs = require('hbs');
var session = require('express-session');
var mongoose = require('mongoose');

//Ameet modules
var cryptoRandomString = require("crypto-random-string");







//setting  express object
var app = express();
//setting handlebars
app.set("view engine", "hbs");
//setting body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//setting multiparty for form reading 
app.use(express.static("uploads"));
app.use(express.static("public"));





//Express-Session
app.use(
    session({
        secret: cryptoRandomString({ length: 10 }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            // maxAge: 1000 * 10,
            path: "/",
            httpOnly: true
        }
    })
);



//connect to mongo  
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Mongodb connected...."))
    .catch(err => console.log(err))

//Routes
//root and loginsignup 
app.use('/', require('./routes/loginsignup'))
//profilesetup
app.use('/', require('./routes/profilesetup'))
//homepage
app.use('/', require('./routes/website'))
app.use('/', require('./routes/settings'))



//activating server at PORT address 
app.listen(PORT, () => {
    console.log("Server is active at port address" + PORT);
});
