var uuid = require("uuid");
module.exports.createSession = function (req, res) {
	req.session.id = uuid.v1();
	req.session.status = "user";
	res.redirect("/profile");
};
