const express = require("express")
const router = express.Router()

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.get("/profile", (req, res) => {
    res.render("profile");

})
router.get("/search", (req, res) => {
    res.render("search");

})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})
router.get("/matchprofile", (req, res) => {
    res.render("matching");

})

module.exports = router