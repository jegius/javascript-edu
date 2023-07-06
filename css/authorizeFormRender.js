const authorizeFormRender = (root, userService) => {
  const submitButtonClass = "submit-button";
  const userInputClass = "user-name";
  const userPasswordClass = "user-password";
  const errorMessageClass = "error-message";

  root.innerHTML = `
    <div class="authorize">
      <label for="user-name" class="user-name__label">
        User Name:
        <input type="text" class="${userInputClass}" />
      </label>
      <label for="user-password" class="user-password__label">
        Password:
        <input type="password" class="${userPasswordClass}" />
      </label>
      <div class="authorize__control">
        <input type="button" value="Submit" class="${submitButtonClass}" />
        <input type="button" value="Create User" class="create-button" />
      </div>
      <div class="${errorMessageClass}"></div>
    </div>
  `;

  const submitButton = root.querySelector(`.${submitButtonClass}`);
  const userInput = root.querySelector(`.${userInputClass}`);
  const createUserButton = root.querySelector(".create-button");
  const errorMessage = root.querySelector(`.${errorMessageClass}`);

  submitButton.addEventListener("click", () => {
    const username = userInput.value;
    const password = userPassword.value;
    userService.authorize(username, password);
  });

  createUserButton?.addEventListener("click", () =>
    userService.setIsNeedToCreate(true)
  );

  function displayErrorMessage(message) {
    errorMessage.innerText = message;
    errorMessage.style.color = "red";
  }

  userService.subscribeOnUserState((userState) => {
    if (userState.error) {
      displayErrorMessage(userState.error);
    } else {
      errorMessage.innerText = "";
    }
  });
};
