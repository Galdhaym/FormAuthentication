window.onload = function(){

    function setError(message){
        var errorList = document.querySelector(".errorList");
        if(!errorList){
            errorList = document.createElement("ul");
            errorList.className = "errorList";
            var form = document.querySelector(".form__container__inner form");
            var firstChild = form.firstChild;
            form.insertBefore(errorList, firstChild);
        }

        var errorLI = document.createElement("li");
        errorLI.className = "validation__error";
        errorLI.innerText = message;
        errorList.appendChild(errorLI);
    }

    function clearErrors(){
        var form = document.querySelector(".form__container__inner form");
        var errorList = document.querySelector(".errorList");
        if(errorList){
            form.removeChild(errorList);
        }
    }

    function validateForm(){
        clearErrors();
        var username = document.getElementById("username").value;
        var passwordElem = document.getElementById("password");
        var password = passwordElem.value;
        var value = true;

        if(username.length === 0){
            value = false;
            setError("Username is empty!");
        }
        else if(username.length <= 6){
            value = false;
            setError("Username must be at least 6 characters!");
        }

        if(password.length === 0){
            value = false;
            setError("Password is empty!");
        }
        else if(password.length < 8){
            value = false;
            setError("Password must be atleast 8 characters!");
        }

        return value;
    }

    function sendFormData(data, url){
        sendRequest(data, url, function(){console.log("success")});
    }

    function sendRequest(data, url, callback){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        
        xhr.responseType = 'json';
        xhr.send(data);

        xhr.onload = callback();
    }

    var formButton = document.querySelector("#login__submit");
    formButton.onclick = function(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var data = {
            username,
            password
        }

        var jsonData = JSON.stringify(data);
        var value = validateForm();
        if(value){
            sendFormData(jsonData, "/login");
        }
    }

}