var multiparty = require("multiparty");
var cloudinary = require("cloudinary").v2;
var bcrypt = require("bcrypt");
const passport = require("passport");
//User model
const Settings = require("../models/settingsSchema.js");
const Signup = require("../models/signupSchema");
const Profile1 = require("../models/profile1Schema.js");
const Profile2 = require("../models/profile2Schema.js");
const Profile3 = require("../models/profile3Schema.js");
const Userpref = require("../models/userprefSchema.js");
const User = require("../models/userSchema");
const cryptoRandomString = require("crypto-random-string");

//clodinary configruation
cloudinary.config(require("../config/keys").CloudinaryURI);

const UserController = {};

UserController.signup = function(req, res) {
  const { mobile, email, createdBy } = req.body;
  var password = req.body.password;

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) console.log(err);
    else {
      password = hash;

      const newUser = new User({});

      const newSignup = new Signup({
        email,
        password,
        mobile,
        createdBy
      });
      newUser.Signup = newSignup;
      newUser
        .save()
        .then(user => {
          res.send("okay");
        })
        .catch(err => console.log(err));
    }
  });
};

UserController.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile/1",
    failureRedirect: "/",
    failureFlash: true
  })(req, res, next);
};

UserController.profile1 = function(req, res) {
  var userId = req.session.passport.user;
  let form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    cloudinary.uploader.upload(files.image[0].path, function(err, result) {
      var userData = {
        name: {
          firstname: fields.firstname[0],
          middlename: fields.middlename[0],
          lastname: fields.lastname[0]
        },

        address: fields.address[0],
        location: {
          country: fields.country[0],
          state: fields.state[0],
          city: fields.city[0]
        }
      };
      if (result) {
        userData.photo = result.secure_url;
      }

      User.findOne({ _id: userId }).then(user => {
        const newProfile1 = new Profile1(userData);
        user.Profile.Profile1 = newProfile1;
        var newSettings = new Settings({
          showname: fields.firstname[0][0] + " " + fields.lastname[0]
        });
        user.Settings = newSettings;

        user
          .save()
          .then(user => {
            console.log("saved user profile1");
            res.redirect("/profile/2");
          })
          .catch(err => console.log(err));
      });
    });
  });
};
UserController.profile2 = function(req, res) {
  data = {
    dob: {
      day: parseFloat(req.body.day),
      month: parseFloat(req.body.month),
      year: parseFloat(req.body.year)
    },
    age: getAge(
      "" +
        parseFloat(req.body.month) +
        "/" +
        parseFloat(req.body.day) +
        "/" +
        parseFloat(req.body.year) +
        ""
    ),
    gender: req.body.gender,
    maritialstatus: req.body.maritialstatus,
    height: req.body.height,
    weight: req.body.weight,
    diet: req.body.diet,
    religion: req.body.religion,
    caste: req.body.caste,
    mothertongue: req.body.mothertongue,
    family: {
      status: req.body.status,
      type: req.body.type
    }
  };
  User.findOne({ _id: req.session.passport.user }).then(user => {
    const newProfile2 = new Profile2(data);
    user.Profile.Profile2 = newProfile2;
    user
      .save()
      .then(user => {
        console.log("saved user profile2");
        res.redirect("/profile/3");
      })
      .catch(err => console.log(err));
  });
};
UserController.profile3 = function(req, res) {
  data = {
    hobbies: req.body.hobbies,
    education: {
      educationlevel: req.body.educationlevel,
      isEmployed: /true/i.test(req.body.isEmployed)
    },
    drinking: req.body.drinking,
    smoking: req.body.smoking
  };
  if (data.education.isEmployed) {
    (data.education.employer = req.body.employer),
      (data.education.salary = parseFloat(req.body.salary));
  }
  User.findOne({ _id: req.session.passport.user }).then(user => {
    const newProfile3 = new Profile3(data);
    user.Profile.Profile3 = newProfile3;
    user
      .save()
      .then(user => {
        console.log("saved user profile3");
        res.redirect("/profile/4");
      })
      .catch(err => {
        console.log(err);
        res.redirect("./profile/3");
      });
  });
};

UserController.profile4 = function(req, res) {
  const AboutYourself = req.body.AboutYourself;
  User.updateOne(
    { _id: req.session.passport.user },
    { "Profile.Profile3.AboutYourself": AboutYourself }
  )
    .then(user => {
      console.log("saved aboutyourself");
      res.redirect("/userpref");
    })
    .catch(err => console.log(err));
};
UserController.profile = function(req, res) {
  User.findOne({ _id: req.session.passport.user })
    .then(user => {
      (user.Profile.Profile2.height = req.body.height),
        (user.Profile.Profile3.disability = req.body.disability),
        (user.Profile.Profile2.age = req.body.age),
        (user.Profile.Profile2.maritialstatus = req.body.maritialstatus),
        (user.Profile.Profile2.religion = req.body.religion),
        (user.Profile.Profile1.location.city = req.body.city),
        (user.Profile.Profile2.mothertongue = req.body.mothertongue),
        (user.Profile.Profile1.location.country = req.body.country),
        (user.Profile.Profile2.weight = req.body.weight),
        (user.Profile.Profile2.diet = req.body.diet),
        (user.Profile.Profile3.sunshine = req.body.sunshine),
        (user.Profile.Profile3.personalvalues = req.body.personalvalues),
        (user.Profile.Profile3.grewup = req.body.grewup),
        (user.Profile.Profile3.bloodgroup = req.body.bloodgroup),
        (user.Profile.Profile3.fluent = req.body.fluent),
        (user.Profile.Profile2.caste = req.body.caste),
        (user.Profile.Profile2.subcaste = req.body.subcaste),
        (user.Profile.Profile3.rashi = req.body.rashi),
        (user.Profile.Profile3.gothra = req.body.gothra),
        (user.Profile.Profile3.manglik = req.body.manglik),
        (user.Profile.Profile3.birthcity = req.body.birthcity),
        (user.Profile.Profile2.family.status = req.body.status),
        (user.Profile.Profile2.family.type = req.body.type),
        (user.Profile.Profile3.fatherstatus = req.body.fatherstatus),
        (user.Profile.Profile3.motherstatus = req.body.motherstatus),
        (user.Profile.Profile3.familylocation = req.body.familylocation),
        (user.Profile.Profile3.nativeplace = req.body.nativeplace),
        (user.Profile.Profile3.siblings = req.body.siblings),
        (user.Profile.Profile3.familyvalues = req.body.familyvalues),
        (user.Profile.Profile3.education.educationlevel =
          req.body.educationlevel),
        (user.Profile.Profile3.workingsector = req.body.workingsector),
        (user.Profile.Profile3.profession = req.body.profession),
        (user.Profile.Profile3.education.employer = req.body.employer),
        (user.Profile.Profile3.education.salary = req.body.salary),
        (user.Profile.Profile3.healthinfo = req.body.healthinfo);
      (user.Profile.Profile3.hobbies = req.body.hobbies),
        (user.Profile.Profile3.interests = req.body.interests),
        (user.Profile.Profile3.favoritemusic = req.body.favoritemusic),
        (user.Profile.Profile3.favoritereads = req.body.favoritereads),
        (user.Profile.Profile3.preferredmovies = req.body.preferredmovies),
        (user.Profile.Profile3.sportactivities = req.body.sportactivities),
        (user.Profile.Profile3.favoritecuisines = req.body.favoritecuisines);
      user.save();
      console.log("data updated");
      res.redirect("/profile");
    })
    .catch(err => console.log(err));
};

UserController.userpref = function(req, res) {
  User.findOne({ _id: req.session.passport.user }).then(user => {
    var userpref = {};

    (userpref.minage = parseInt(req.body.age.split("-")[0])),
      (userpref.maxage = parseInt(req.body.age.split("-")[1])),
      (userpref.height = req.body.height),
      (userpref.religion = req.body.religion),
      (userpref.mothertongue = req.body.mothertongue),
      (userpref.maritialstatus = req.body.maritialstatus),
      (userpref.diet = req.body.diet),
      (userpref.location = {});

    (userpref.location.country = req.body.country),
      (userpref.location.state = req.body.state),
      (userpref.location.city = req.body.city);
    userpref.education = {};
    (userpref.education.educationlevel = req.body.educationlevel),
      (userpref.education.workingwith = req.body.workingwith),
      (userpref.education.employer = req.body.employer),
      (userpref.education.salary = req.body.salary);

    const newuserpref = new Userpref(userpref);
    console.log(newuserpref);
    user.Userpref = newuserpref;
    user.save().then(() => {
      res.redirect("/home");
    });
  });
};

UserController.album = function(req, res) {
  User.findOne({ _id: req.session.passport.user }).then(user => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      cloudinary.uploader.upload(files.album[0].path, function(err, result) {
        if (result) {
          user.myAlbum.push(result.secure_url);
          //console.log(user)
          user.save().then(() => {
            res.redirect("/profile");
          });
        }
      });
    });
  });
};

UserController.social = (req, res) => {
  const { mobile, createdBy } = req.body;
  User.findById(req.session.passport.user).then(user => {
    // console.log(user);
    const email = user.Signup.email;
    var password = cryptoRandomString({ length: 20 });
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) console.log(err);
      else {
        password = hash;

        var facebookid = user.Signup.facebookid;
        var googleid = user.Signup.googleid;
        const newSignup = new Signup({
          email,
          password,
          mobile,
          createdBy,
          facebookid,
          googleid
        });
        user.Signup = newSignup;
        user
          .save()
          .then(user => {
            res.redirect("/profile/1");
          })
          .catch(err => console.log(err));
      }
    });
  });
};

module.exports = UserController;

function getAge(DOB) {
  var today = new Date();
  var birthDate = new Date(DOB);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1;
  }

  return age;
}
