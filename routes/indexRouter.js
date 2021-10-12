var express = require("express");
var router = express.Router();
var session = require("../middlewares/session__middleware");
var validation = require("../controllers/validateFormDataController");
var postController = require("../controllers/postController");
var getController = require("../controllers/getController");
var sessionController = require("../controllers/sessionController");
var formData = require("../controllers/multipart-parser");

router.get("/", function (req, res) {
	res.redirect("/login");
});

router.get("/login", session.sessionMiddleware, function (req, res) {
	res.redirect("/profile");
});

router.get("/signup", session.sessionMiddleware, function (req, res) {
	res.redirect("/profile");
});

router.get("/profile", session.sessionMiddleware, getController.getProfileInfo, function (req, res) {
	var userInfo = res.locals.userInfo;
	res.render("profile.ejs", {
		username: userInfo.username,
		avatar: userInfo.avatar
	});
});

router.get("/edit", session.sessionMiddleware, getController.getProfileInfo, function (req, res) {
	var userInfo = res.locals.userInfo;
	res.render("editProfile.ejs", {
		username: userInfo.username,
		age: userInfo.age,
		description: userInfo.description,
		avatar: userInfo.avatar
	});
});

router.post("/login", validation.validateLoginForm, postController.AuthLogin, sessionController.createSession);

router.post("/signup", validation.validateSignUpForm, postController.AuthSignUp, sessionController.createSession);

router.post(
	"/edit",
	formData.formImage,
	session.sessionMiddleware,
	validation.validateProfileInfo,
	postController.updateUserInfo,
	function (req, res) {
		res.send(true);
	}
);

router.post("/delete", session.sessionMiddleware, sessionController.deleteSession);

module.exports = router;
