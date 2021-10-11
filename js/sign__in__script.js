window.onload = function () {
	function setError(message) {
		var errorList = document.querySelector(".errorList");
		if (!errorList) {
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

	function clearErrors() {
		var form = document.querySelector(".form__container__inner form");
		var errorList = document.querySelector(".errorList");
		if (errorList) {
			form.removeChild(errorList);
		}
	}

	function validateForm() {
		clearErrors();
		var username = document.getElementById("username").value;
		var passwordElem = document.getElementById("password");
		var email = document.getElementById("email").value;
		var password = passwordElem.value;
		var value = true;

		var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
		var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (username.length === 0) {
			value = false;
			setError("Username is empty!");
		} else if (username.length <= 6) {
			value = false;
			setError("Username must be at least 6 characters!");
		}

		if (email.length === 0) {
			value = false;
			setError("Email is empty!");
		} else if (!emailRegex.test(email)) {
			value = false;
			setError("Email is incorrect!");
		}

		if (password.length === 0) {
			value = false;
			setError("Password is empty!");
		} else if (password.length < 8) {
			value = false;
			setError("Password must be at least 8 characters!");
		} else {
			if (strongRegex.test(password)) {
				passwordElem.style.background = "green";
			} else if (mediumRegex.test(password)) {
				passwordElem.style.background = "orange";
			} else {
				passwordElem.style.background = "red";
			}
		}
		return value;
	}

	function sendFormData(e) {
		e.preventDefault();
		var username = document.getElementById("username").value;
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;

		var data = {
			username,
			email,
			password
		};
		var jsonData = JSON.stringify(data);

		if (validateForm()) {
			sendData(jsonData, "/signup");
		}
	}

	function redirectToProfilePage() {
		if (this.status === 200) {
			window.location.pathname = "/profile";
		} else if (this.status === 400) {
			clearErrors();
			setError(this.response);
		}
	}

	function sendData(data, url) {
		sendPostRequest(data, url, redirectToProfilePage);
	}

	function sendPostRequest(data, url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);

		xhr.onload = callback;
	}

	var form = document.getElementById("signin__form");
	form.onsubmit = sendFormData;
};
