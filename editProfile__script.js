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

    function validateUsername(username){
        var value = true;
        if(username.length === 0){
            setError("Username is empty!");
            value = false;
        }
        else if(username.length < 6 || username.length > 20){
            setError("Username must be more than 6 characters and less than 20 characters!");
            value = false;
        }
        return value;
    }

    function validateAge(age){
        var value = true;
        var age = Number(age);
        if(!Number.isInteger(age)){
            setError("Age is not Number!");
            value = false;
        }
        return value;
    }

    function validateDescription(description){
        var value = true;
        if(description.length > 120){
            setError("Description length does not have to be more than 120!");
            value = false;
        }
        return value;
    }

    function validateForm(){
        clearErrors();
        var username = document.getElementById("username").value;
        var age = document.getElementById("age").value;
        var description = document.getElementById("description").value;

        var value = validateUsername(username) && validateAge(age) && validateDescription(description);
        return value;
    }

    function sendFormData(data, url){
        sendRequest(data, function(){

        });
    }

    function sendRequest(data, callback){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        xhr.onload = callback;
    }

    var editProfileButton = document.getElementById("updateProfile");
    editProfileButton.onclick = function(){
        var username = document.getElementById("username").value;
        var age = document.getElementById("age").value;
        var description = document.getElementById("description").value;

        var UserData = {
            username,
            age,
            description
        }
        var jsonData = JSON.stringify(UserData);
        var value = validateForm();
        if(value){
            sendFormData(jsonData, "/edit");
        }
    };
}