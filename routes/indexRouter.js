var express = require('express');
var router = express.Router();
var session = require("../session__middleware");
var validation = require("../validateFormDataController")
var postController = require("../postController");
var uuid = require("uuid");

router.get("/", function(req, res){
    res.redirect("/login");
});

router.get("/login", session.sessionMiddleware, function(req, res){
    res.redirect("/profile");
});

router.get("/signup", session.sessionMiddleware, function(req, res){
    res.redirect("/profile");
});

router.post("/login", validation.validateLoginForm);

router.post("/signup", validation.validateSignUpForm, postController.AuthSignUp, function(req, res){
    req.session.id = uuid.v1();
    req.session.status = "user";
    res.redirect("/profile");
});

module.exports = router;