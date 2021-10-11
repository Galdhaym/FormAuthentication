var sessionStore = require("../app");

module.exports.sessionMiddleware = function (req, res, next) {
	var sessionID = req.session.id;
	sessionStore.store.get(sessionID, function (err, session) {
		if (err) {
			console.log(err);
		} else if (session == null || session == undefined) {
			if (req.url === "/login") {
				res.render("index.ejs");
			} else if (req.url === "/signup") {
				res.render("sign__in__page.ejs");
			} else {
				res.redirect("/login");
			}
		} else {
			res.locals.userSession = session;
			next();
		}
	});
};
