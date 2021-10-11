module.exports.validateLoginForm = function (req, res, next) {
	if (req.body.username.length >= 6 && req.body.password.length > 8) {
		next();
	} else {
		res.status(400).send("Login validation error!");
	}
};

module.exports.validateSignUpForm = function (req, res, next) {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (req.body.username.length >= 6 && req.body.password.length > 8 && emailRegex.test(req.body.email)) {
		next();
	} else {
		res.status(400).send("Sign up validation error!");
	}
};

module.exports.validateProfileInfo = function (req, res, next) {
	var age = req.body.age;
	var AgeIsEmpty = age.length === 0;
	var age = Number(age);
	var isInt = Number.isInteger(age);
	var ageRange = age >= 6 && age <= 120;
	var usernameRange = req.body.username.length >= 6 && req.body.username.length <= 30;
	var descriptionRange = req.body.description.length <= 120;
	if (usernameRange && (isInt || AgeIsEmpty) && ageRange && descriptionRange) {
		next();
	}
};
