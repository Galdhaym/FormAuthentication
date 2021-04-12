var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'zlatodima',
    database : 'regformdb'
});

module.exports.connection = connection;