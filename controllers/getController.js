var mySQL = require("./dbConnectionController");
module.exports.getProfileInfo = function (req, res, next) {
	var session = res.locals.userSession;
	var userID = session.userID;
	selectUserDataFromDB(userID)
		.then((result) => {
			res.locals.userInfo = result[0];
			next();
		})
		.catch((err) => {
			throw err;
		});
};

function selectUserDataFromDB(userID) {
	return new Promise(function (resolve, reject) {
		var query = "Select * From userProfileInfo Where user_id = ?";
		mySQL.connection.query(query, userID, function (err, result) {
			if (err) {
				reject(err);
			} else resolve(result);
		});
	});
}

module.exports.selectUserDataFromDB = selectUserDataFromDB;
