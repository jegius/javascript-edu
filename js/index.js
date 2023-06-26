async function sendRequest(address, endpoint, body) {
    const response = await fetch(`${address}/${endpoint}`, body);
    return await response.json();
}

function carriedRequest(address, endpoint) {
    return async (body) => await sendRequest(address, endpoint, body);
}

function updateMessage(newMessages, store) {
    store.messageHistory = newMessages
}

function carriedStore(store) {
    return (data) => updateMessage(data, store);
}

const messageService = (function (serverAddress) {
    const POOLING_INTERVAL = 1000;
    const MESSAGE_ENDPOINT = 'messages'
    const messageStore = {
        currentUser: null,
        messageHistory: []
    };
    const messageSubscriptions = [];
    const userSubscriptions = [];

    const carriedData = carriedRequest(serverAddress, MESSAGE_ENDPOINT);

    function recallMessageSubscriptions() {
        messageSubscriptions.map(callback => callback(messageStore))
    }

    function recallUserSubscriptions() {
        userSubscriptions.map(callback => callback(messageStore.currentUser))
    }
    const updateStore = carriedStore(messageStore);

    async function getMessages() {
        const messages = await carriedData();
        updateStore(messages);
        recallMessageSubscriptions();
    }

    async function sendMessages(message) {
        const messages = await carriedData({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        updateStore(messages);
        recallMessageSubscriptions();
    }

    setInterval(getMessages, POOLING_INTERVAL);

    return {
        init: async () => {
            await getMessages();
        },
        getCurrentUser: () => messageStore.currentUser,
        authorize: (user) => {
            messageStore.currentUser = user;
            recallUserSubscriptions();
        },
        userSubscription: (callback) => {
            userSubscriptions.push(callback);
        },
        send: async (message) => {
            await sendMessages(message)
        },
        subscribeOnMessages: (callback) => {
            messageSubscriptions.push(callback);
            callback(messageStore);
        }
    }
})('http://localhost:3000');

function Message(id, user, message) {
    this.id = id;
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
            null,
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
            messageService.init();

            messageService.userSubscription(selectUserState)
        },
    }
})({applicationClass: '.app', messageService})

application.init();