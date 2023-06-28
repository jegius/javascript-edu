export function authorizeFormRender(root, userService) {
    const submitButtonClass = 'submit-button';
    const userInputClass = 'user-name';
    const userPasswordClass = 'user-name _password';

    root.innerHTML = `<div class="authorize">
        <label for="user-name" class="user-name__label">
            User Name:
            <input type="text" class="${userInputClass}" />
        </label>
        <label for="user-name" class="user-name__label">
            Password:
            <input type="password" class="${userPasswordClass}" />
        </label>
        <div class="authorize__control">
            <input type="button" value="Submit" class="submit-button" />
            <input type="button" value="Create User" class="create-button" />
        </div>
    </div>`;

    const submitButton = root.querySelector(`.${submitButtonClass}`);
    const userInput = root.querySelector(`.${userInputClass}`);

    submitButton.addEventListener('click', () => userService.authorize(userInput.value))
}