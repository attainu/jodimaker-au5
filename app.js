//global variables
var PORT = process.env.PORT || 3000;
//DB config
require("dotenv").config()
const db = require("./config/keys").MongoURI;
var user_dataId;
//Using npm packages
var express = require("express");
var exphbs = require("hbs");
var session = require("express-session");
var mongoose = require("mongoose");
const passport = require("passport")
require('./config/passport')(passport)

//Ameet modules
var cryptoRandomString = require("crypto-random-string");

//setting  express object
var app = express();
var server = require('http').createServer(app)
const flash = require("connect-flash")
//setting handlebars
// app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'layouts', layoutsDir: __dirname + "/views" }))
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
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      path: "/",
      httpOnly: true
    },
    rolling: true
  })
);
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  
  res.locals.error = req.flash('error')
  next()
})

var server = require('http').Server(app)
var io = require('socket.io')(server)
var website = require("./routes/website")(io)

//connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Mongodb connected...."))
  .catch(err => console.log(err));

//activating server at PORT address
server.listen(PORT, () => {
  console.log("Server is active at port address" + PORT);
});

//Routes 
//root and loginsignup
app.use("/", require("./routes/loginsignup"));
//profilesetup
app.use("/", require("./routes/profilesetup"));
//homepage
app.use("/", website);
app.use("/", require("./routes/settings"));


// io.on('connection', (socket) => {
//   console.log("someone connected")
// })
