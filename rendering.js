export function rerenderMessages(
  messageHistory,
  messageContainer,
  currentUser
) {
  messageContainer.innerHTML = `${messageHistory
    .map((message) => messageBubbleRenderer(currentUser, message))
    .join("")}`;
}

export function messageBubbleRenderer(currentUser, { user, message }) {
  return `<div class="message-bubble_${
    currentUser === user ? "right" : "left"
  }">
        <div class="message-bubble__user">${user}:</div>
        <div class="message-bubble__message">${message}</div>
    </div>`;
}

export function messengerRender(root, messageService) {
  const messageClass = "message-container";
  const inputMessageClass = "message-area";
  const submitButton = "submit";

  root.innerHTML = `<div class="main">
        <div class="${messageClass}"></div>
        <div class="control">
            <textarea name="message" class="${inputMessageClass}"></textarea>
            <input type="button" value="Submit" class="${submitButton}">
        </div>
    </div>`;

  function sendMessage(message, messageService, textArea) {
    messageService.send(
      new Message(null, messageService.getCurrentUser(), message)
    );
    textArea.value = "";
  }

  const messageContainer = root.querySelector(`.${messageClass}`);
  const messageBody = root.querySelector(`.${inputMessageClass}`);
  const submit = root.querySelector(`.${submitButton}`);

  messageService.subscribeOnMessages(({ messageHistory }) =>
    rerenderMessages(
      messageHistory,
      messageContainer,
      messageService.getCurrentUser()
    )
  );
  submit.addEventListener("click", () =>
    sendMessage(messageBody.value, messageService, messageBody)
  );
}

export function authorizeFormRender(root, messageService) {
  const submitButtonClass = "submit-button";
  const userInputClass = "user-name";

  root.innerHTML = `<div class="authorize">
        <label for="user-name" class="user-name__label">
            User Name:
            <input type="text" class="${userInputClass}" />
        </label>
        <input type="button" value="Submit" class="submit-button" />
    </div>`;

  const submitButton = root.querySelector(`.${submitButtonClass}`);
  const userInput = root.querySelector(`.${userInputClass}`);

  submitButton.addEventListener("click", () =>
    messageService.authorize(userInput.value)
  );
}
