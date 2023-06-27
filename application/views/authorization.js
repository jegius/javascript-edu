export function authorizeFormRender(root, messageService) {
    const submitButtonClass = 'submit-button';
    const userInputClass = 'user-name';

    root.innerHTML = `<div class="authorize">
        <label for="user-name" class="user-name__label">
            User Name:
            <input type="text" class="${userInputClass}" />
        </label>
        <input type="button" value="Submit" class="submit-button" />
    </div>`;

    const submitButton = root.querySelector(`.${submitButtonClass}`);
    const userInput = root.querySelector(`.${userInputClass}`);

    submitButton.addEventListener('click', () => messageService.authorize(userInput.value))
}