window.onload = function () {
	var imageBinaryFile = null;
	function setError(message) {
		var errorList = document.querySelector(".errorList");
		if (!errorList) {
			errorList = document.createElement("ul");
			errorList.className = "errorList";
			var form = document.querySelector(".edit__profile__form");
			var firstChild = form.firstChild;
			form.insertBefore(errorList, firstChild);
		}

		var errorLI = document.createElement("li");
		errorLI.className = "validation__error";
		errorLI.innerText = message;
		errorList.appendChild(errorLI);
	}

	function clearErrors() {
		var form = document.querySelector(".edit__profile__form");
		var errorList = document.querySelector(".errorList");
		if (errorList) {
			form.removeChild(errorList);
		}
	}

	function validateUsername(username) {
		var value = true;
		if (username.length === 0) {
			setError("Username is empty!");
			value = false;
		} else if (username.length < 6 || username.length > 30) {
			setError("Username must be more than 6 characters and less than 30 characters!");
			value = false;
		}
		return value;
	}

	function validateAge(age) {
		var value = true;
		var numberAge = Number(age);
		if (!Number.isNaN(numberAge)) {
			if (!Number.isInteger(numberAge)) {
				setError("Age is not an integer!");
				value = false;
			} else if (numberAge < 6 && numberAge > 120) {
				setError("Age must be between 6 and 120!");
				value = false;
			}
		} else if (age.length != 0) {
			setError("Age is not an number!");
			value = false;
		}
		return value;
	}

	function validateDescription(description) {
		var value = true;
		if (description.length > 120) {
			setError("Description length does not have to be more than 120!");
			value = false;
		}
		return value;
	}

	function validateForm() {
		clearErrors();
		var username = document.getElementById("username").value;
		var age = document.getElementById("age").value;
		var description = document.getElementById("description").value;
		var value = validateUsername(username) && validateAge(age) && validateDescription(description);
		return value;
	}

	function sendFormData(data, url) {
		sendRequest(data, url, function () {
			clearProfileWasUpdatedPanel();
			var editProfileContainer = document.querySelector(".edit__profile__container");
			var profileMiddleContainer = document.querySelector(".edit__profile__middle__container");

			var profileWasEditedContainer = document.createElement("div");
			profileWasEditedContainer.className = "profileWasEditedContainer";

			var profileWasEditedContainerInner = document.createElement("div");
			profileWasEditedContainerInner.className = "profileWasEditedContainerInner";

			var profileWasEditedElement = document.createElement("span");
			profileWasEditedElement.id = "profileWasEditedElement";
			profileWasEditedElement.textContent = "Profile was updated!";

			var closeProfileWasEditedPanel = document.createElement("img");
			closeProfileWasEditedPanel.id = "closeProfileWasEditedPanel";
			closeProfileWasEditedPanel.src = "../images/krest.png";
			closeProfileWasEditedPanel.addEventListener("click", function () {
				editProfileContainer.removeChild(profileWasEditedContainer);
			});

			profileWasEditedContainerInner.appendChild(profileWasEditedElement);
			profileWasEditedContainerInner.appendChild(closeProfileWasEditedPanel);
			profileWasEditedContainer.appendChild(profileWasEditedContainerInner);
			editProfileContainer.insertBefore(profileWasEditedContainer, profileMiddleContainer);
		});
	}

	function clearProfileWasUpdatedPanel() {
		var editProfileContainer = document.querySelector(".edit__profile__container");
		var profileWasEditedContainer = document.querySelector(".profileWasEditedContainer");
		if (profileWasEditedContainer) editProfileContainer.removeChild(profileWasEditedContainer);
	}

	function sendRequest(data, url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);

		xhr.send(data);
		xhr.onload = callback;
	}

	var editProfileButton = document.getElementById("updateProfile");
	editProfileButton.onclick = function (e) {
		e.preventDefault();
		var value = validateForm();
		if (value) {
			var username = document.getElementById("username").value;
			var age = document.getElementById("age").value;
			var description = document.getElementById("description").value;

			var formData = new FormData();
			formData.append("username", username);
			formData.append("age", age);
			formData.append("description", description);
			formData.append("binaryImg", imageBinaryFile);
			sendFormData(formData, "/edit");
		}
	};

	var fileButton = document.getElementById("imageReader");
	fileButton.addEventListener("change", function () {
		if (this.files.length === 1) {
			var imgURL = URL.createObjectURL(this.files[0]);
			var avatarImg = document.getElementById("avatar");
			if (avatarImg) {
				avatarImg.src = imgURL;
			} else {
				avatarImg = document.createElement("img");
				avatarImg.id = "avatar";
				avatarImg.src = imgURL;
				avatarImg.className = "avatar__image";
			}

			avatarImg.onload = () => {
				URL.revokeObjectURL(this.src);
			};

			var imageContainer = document.querySelector(".avatar__image__container");
			imageContainer.appendChild(avatarImg);
			imageBinaryFile = this.files[0];
		}
	});

	var updateAvatarButton = document.querySelector(".edit__avatar__button");
	updateAvatarButton.addEventListener("click", function () {
		fileButton.click();
	});
};
