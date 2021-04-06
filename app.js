var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.redirect("/login");
});

app.get("/login", function(req, res){
    res.render("index.ejs");
});

app.get("/signup", function(req, res){
    res.render("sign__in__page.ejs");
});

app.get("/loginSubmit", function(req, res){
    res.send("success");
}); 

app.listen(3000);