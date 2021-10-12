var mySQL = require("./dbConnectionController");
var getController = require("./getController");
var passwordHash = require("password-hash");
var uuid = require("uuid");
const fs = require("fs").promises;

module.exports.AuthLogin = function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var userData = { username, password };
	selectUserFromDB(userData)
		.then((userID) => {
			req.session.userID = userID;
			next();
		})
		.catch((err) => {
			if (err instanceof Error) {
				throw err;
			} else {
				res.status(400).send(err);
			}
		});
};

module.exports.AuthSignUp = function (req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var userID = uuid.v1();
	const defaultAvatar = "netero.jpg";
	var userData = { userID, username, email, password, defaultAvatar };
	selectAllEmailsFromDB(email)
		.then(function (result) {
			selectAllUsernamesFromDB(username)
				.then(function (result) {
					addNewUserToDB(userData)
						.then((result) => {
							addNewUserInfoTODB(userData)
								.then((result) => {
									req.session.userID = userID;
									next();
								})
								.catch((err) => {
									throw err;
								});
						})
						.catch((err) => {
							throw err;
						});
				})
				.catch(function (err) {
					if (err instanceof Error) {
						throw err;
					} else {
						res.status(400).send(err);
					}
				});
		})
		.catch(function (err) {
			if (err instanceof Error) {
				throw err;
			} else {
				res.status(400).send(err);
			}
		});
};

module.exports.updateUserInfo = function (req, res, next) {
	var username = req.body.username;
	var age = req.body.age;
	var description = req.body.description;
	var avatar = req.file;
	const defaultAvatar = "netero.jpg";
	var session = res.locals.userSession;
	var userID = session.userID;

	if (avatar) {
		var mimeType = avatar.mimetype;
		var splitedMimeType = mimeType.split("/");
		console.log(splitedMimeType);
		var fileExtension = "." + splitedMimeType[1];
		console.log(avatar);

		getController.selectUserDataFromDB(userID).then((result) => {
			var avatarIntoTable = result[0].avatar;
			if (avatarIntoTable !== null) {
				var avatarID = uuid.v1();
				var newAvatar = avatarID + fileExtension;
				var toPath = "uploads/" + newAvatar;
				if (avatarIntoTable === defaultAvatar) {
					fs.writeFile(toPath, avatar.buffer).then((value) => {
						var userData = { userID, username, age, description, newAvatar };
						updateUserInfoIntoTable(userData)
							.then((result) => {
								next();
							})
							.catch((err) => {
								throw err;
							});
					});
				} else {
					var fromPath = "uploads/" + avatarIntoTable;
					fs.rename(fromPath, toPath).then((value) => {
						fs.writeFile(toPath, avatar.buffer).then((value) => {
							var userData = { userID, username, age, description, newAvatar };
							updateUserInfoIntoTable(userData)
								.then((result) => {
									next();
								})
								.catch((err) => {
									throw err;
								});
						});
					});
				}
			}
		});
	} else {
		getController.selectUserDataFromDB(userID).then((result) => {
			var avatarIntoTable = result[0].avatar;
			var newAvatar = avatarIntoTable;
			var userData = { userID, username, age, description, newAvatar };
			updateUserInfoIntoTable(userData).then((result) => {
				next();
			});
		});
	}
};

function updateUserInfoIntoTable(userData) {
	return new Promise(function (resolve, reject) {
		var query = "Update userProfileInfo Set username = ?, age = ?, description = ?, avatar = ? Where user_id = ?";
		mySQL.connection.query(
			query,
			[userData.username, userData.age, userData.description, userData.newAvatar, userData.userID],
			function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			}
		);
	});
}

function selectAllEmailsFromDB(email) {
	return new Promise(function (resolve, reject) {
		var query = "SELECT * FROM userData WHERE email = ?";
		mySQL.connection.query(query, email, function (err, result) {
			if (err) {
				reject(new Error(err));
			} else if (result.length > 0) {
				reject("User exists with this email!");
			} else {
				resolve(true);
			}
		});
	});
}

function selectAllUsernamesFromDB(username) {
	return new Promise(function (resolve, reject) {
		var query = "SELECT * FROM userData WHERE username = ?";
		mySQL.connection.query(query, username, function (err, result) {
			if (err) {
				reject(new Error(err));
			} else if (result.length > 0) {
				reject("User exists with this name!");
			} else {
				resolve(true);
			}
		});
	});
}

function getHashPassword(password) {
	return passwordHash.generate(password);
}

function addNewUserToDB(userData) {
	var password = getHashPassword(userData.password);
	return new Promise((resolve, reject) => {
		var query = "Insert INTO userData (user_id, username, email, password) values(?, ?, ?, ?)";
		mySQL.connection.query(query, [userData.userID, userData.username, userData.email, password], function (err, result) {
			if (err) reject(err);
			else resolve(true);
		});
	});
}

function addNewUserInfoTODB(userData) {
	return new Promise((resolve, reject) => {
		var query = "Insert INTO userProfileInfo (user_id, username, age, description, avatar) values(?, ?, ?, ?, ?)";
		mySQL.connection.query(query, [userData.userID, userData.username, null, "", userData.defaultAvatar], function (err, result) {
			if (err) reject(err);
			else resolve(true);
		});
	});
}

function selectUserFromDB(userData) {
	return new Promise((resolve, reject) => {
		var query = "SELECT * FROM userData WHERE username = ?";
		mySQL.connection.query(query, userData.username, function (err, result) {
			if (err) {
				reject(err);
			} else if (result.length > 0) {
				if (passwordHash.verify(userData.password, result[0].password)) {
					resolve(result[0].user_id);
				} else {
					reject("Username or password is invalid!");
				}
			} else {
				reject("Username or password is invalid!");
			}
		});
	});
}
