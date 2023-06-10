const messageService = (function () {
    const messageStore = {
        currentUser: null,
        messageHistory: []
    };
    const messageChannel = new BroadcastChannel('messageChannel');
    const messageSubscriptions = [];
    const userSubscriptions = [];
    messageChannel.addEventListener('message', ({data}) => {
        messageStore.messageHistory.push(data);
        recallMessageSubscriptions();
    })

    function recallMessageSubscriptions() {
        messageSubscriptions.map(callback => callback(messageStore))
    }

    return {
        getCurrentUser: () => messageStore.currentUser,
        authorize: (user) => {
            messageStore.currentUser = user;
            userSubscriptions.map(callback => callback(messageStore.currentUser))
        },
        userSubscription: (callback) => {
            userSubscriptions.push(callback);
        },
        send: (message) => {
            messageStore.messageHistory.push(message);
            messageChannel.postMessage(new Message(messageStore.currentUser, message.message));
            recallMessageSubscriptions()

        },
        subscribeOnMessages: (callback) => {
            messageSubscriptions.push(callback);
            callback(messageStore);
        }
    }
})();

function Message(user, message) {
    this.message = message;
    this.user = user;
}


function rerenderMessages (messageHistory, messageContainer, currentUser) {
    messageContainer.innerHTML = `${messageHistory.map((message) => messageBubbleRenderer(currentUser, message)).join('')}`
}

function messageBubbleRenderer(currentUser, {user, message}) {

    return `<div class="message-bubble_${currentUser === user ? 'right' : 'left'}">
        <div class="message-bubble__user">${user}:</div>
        <div class="message-bubble__message">${message}</div>
    </div>`
}

function messengerRender(root, messageService) {
    const messageClass = 'message-container';
    const inputMessageClass = 'message-area';
    const submitButton = 'submit';

    root.innerHTML = `<div class="main">
        <div class="${messageClass}"></div>
        <div class="control">
            <textarea name="message" class="${inputMessageClass}"></textarea>
            <input type="button" value="Submit" class="${submitButton}">
        </div>
    </div>`;

    function sendMessage(message, messageService, textArea) {
        messageService.send(new Message(
            messageService.getCurrentUser(),
            message
        ))
        textArea.value = '';
    }

    const messageContainer = root.querySelector(`.${messageClass}`);
    const messageBody = root.querySelector(`.${inputMessageClass}`);
    const submit = root.querySelector(`.${submitButton}`);



    messageService.subscribeOnMessages(({messageHistory}) => rerenderMessages(messageHistory, messageContainer, messageService.getCurrentUser()))
    submit.addEventListener('click', () => sendMessage(messageBody.value, messageService, messageBody))

}

function authorizeFormRender(root, messageService) {
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

const application = (function({applicationClass = '', messageService}) {
    const root = document.querySelector(applicationClass);

    function selectUserState(user) {
            if(user) {
                messengerRender(root, messageService);
            } else {
                authorizeFormRender(root, messageService);
            }
    }

    return {
        init: () => {
            selectUserState();
            messageService.userSubscription(selectUserState)
        },
    }
})({applicationClass: '.app', messageService})

application.init();