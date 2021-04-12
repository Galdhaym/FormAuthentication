var mySQL = require("./dbConnectionController");
var passwordHash = require('password-hash');

module.exports.AuthLogin = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

}

module.exports.AuthSignUp = function(req, res, next){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var userData = {username, email, password};
    selectAllEmailsFromDB(email).then(function(result){
        selectAllUsernamesFromDB(username).then(function(result){
            addNewUserToDB(userData).then((result)=>{
                next();
            }).catch((err)=>{throw err});
        }).catch(function(err){
            if(err instanceof Error){
                throw err;
            }
            else{
                res.send(err);
            }
        });
    }).catch(function(err){
        if(err instanceof Error){
            throw err;
        }
        else{
            res.send(err);
        }
    });
}

function selectAllEmailsFromDB(email){
    return new Promise(function(resolve, reject){
        var query = "SELECT * FROM userData WHERE email = ?";
        mySQL.connection.query(query, email, function(err, result){
            if(err){
                reject(new Error(err));
            }
            else if(result.length > 0){
                reject("User exists with this email!");
            }
            else{
                resolve(true);
            }
        });
    });
}

function selectAllUsernamesFromDB(username){
    return new Promise(function(resolve, reject){
        var query = "SELECT * FROM userData WHERE username = ?";
        mySQL.connection.query(query, username, function(err, result){
            if(err){
                reject(new Error(err));
            }
            else if(result.length > 0){
                reject("User exists with this name!");
            }
            else{
                resolve(true);
            }
        });
    });
}

function getHashPassword(password){
    return passwordHash.generate(password);
}

function addNewUserToDB(userData){
    var password = getHashPassword(userData.password);
    return new Promise((resolve, reject)=>{
        var query = "Insert INTO userData (username, email, password) values(?, ?, ?)";
        mySQL.connection.query(query, [userData.username, userData.email, password], function(err, result){
            if(err) reject(err)
            else resolve(true);
        });
    });
}

function selectUserFromDB(userData){
    return new Promise((resolve, reject)=>{
        var query = "SELECT * FROM userData WHERE username = ?";
        mySQL.connection.query(query, userData.username, function(err, result){

        });
    });
}