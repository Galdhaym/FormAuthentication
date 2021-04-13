var express = require('express');
var router = express.Router();
var session = require("../session__middleware");
var validation = require("../validateFormDataController")
var postController = require("../postController");
var sessionController = require("../sessionController");

router.get("/", function(req, res){
    res.redirect("/login");
});

router.get("/login", session.sessionMiddleware, function(req, res){
    res.redirect("/profile");
});

router.get("/signup", session.sessionMiddleware, function(req, res){
    res.redirect("/profile");
});

router.post("/login", validation.validateLoginForm, postController.AuthLogin, sessionController.createSession);

router.post("/signup", validation.validateSignUpForm, postController.AuthSignUp, sessionController.createSession);

module.exports = router;