export function createUserRenderer(root, userService) {
    const submitButtonClass = 'submit-button';
    const userInputClass = 'user-name';
    const userPasswordClass = 'user-name _password';

    root.innerHTML = `<div class="authorize">
        <label for="user-name" class="user-name__label">
            User Name:
            <input type="text" class="${userInputClass}" id="user-name"/>
        </label>
        <label for="user-password" class="user-name__label">
            User Password: 
            <input type="password" class="${userPasswordClass}" id="user-password"/>
        </label>
        <label for="confirm-password" class="user-name__label">
            Confirm Password: 
            <input type="password" class="${userPasswordClass}" id="confirm-password"/>
        </label>  
        <div class="authorize__control">
            <input type="button" value="Submit" class="submit-button" />
            <input type="button" value="Cancel" class="cancel-button" />
        </div>
    </div>`;

    const submitButton = root.querySelector(`.${submitButtonClass}`);
    const cancelButton = null;
    const userInput = root.querySelector(`.${userInputClass}`);

    submitButton.addEventListener('click', () => userService.createUser())
    cancelButton?.addEventListener('click', () => userService.cancel())
}