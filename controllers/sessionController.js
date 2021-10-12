var uuid = require("uuid");
module.exports.createSession = function (req, res) {
	req.session.id = uuid.v1();
	req.session.status = "user";
	res.redirect("/profile");
};

module.exports.deleteSession = function (req, res) {
	req.session.destroy(function (err) {
		res.redirect("/login");
	});
};
