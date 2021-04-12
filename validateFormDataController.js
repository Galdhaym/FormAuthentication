module.exports.validateLoginForm = function(req, res, next){
    if(req.body.username.length >= 6 && req.body.password.length > 8){
        next();
    }
    else{
        if(req.url === "/login"){
            res.render("index.ejs");
        }
        else{
            res.render("sign__in__page.ejs");
        }
    }
}

module.exports.validateSignUpForm = function(req, res, next){
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(req.body.username.length >= 6 && req.body.password.length > 8 && emailRegex.test(req.body.email)){
        next();
    }
    else{
        if(req.url === "/login"){
            res.render("index.ejs");
        }
        else{
            res.render("sign__in__page.ejs");
        }
    }
}