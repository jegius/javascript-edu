const messageService = (function () {
    const messageStore = {
        users: [],
        messageHistory: []
    };
    const messageSubscriptions = [];
    const userSubscriptions = [];

    return {
        authorize: (user) => {
            messageStore.users.push(user);
            userSubscriptions.map(callback => callback(messageStore.users))
        },
        userSubscription: (callback) => {
            userSubscriptions.push(callback);
        },
        send: (message) => {
            messageStore.push(message);
            messageSubscriptions.map(callback => callback(messageStore.messageHistory))

        },
        subscribeOnMessages: (callback) => {
            messageSubscriptions.push(callback);
            callback(messageStore);
        }
    }
})();

function massagerRender(root) {

    const container = document.createElement('div');
    container.classList.add('main');
    const control = document.createElement('div');
    control.classList.add('control');
    const messages = document.createElement('div');
    messages.classList.add('messages');

    container.append(control);
    container.append(messages);
    root.innerHTML = '';
    root.append(container)
}

function authorizeFormRender(root, messageService) {
    root.innerHTML = '';
    const authorizeForm = document.createElement('div');
    authorizeForm.classList.add('authorize');

    const userNameInput = document.createElement('input');
    userNameInput.setAttribute('type', 'text');
    userNameInput.classList.add('user-name');

    const userNameLabel = document.createElement('label');
    userNameLabel.append('User Name: ')
    userNameLabel.append(userNameInput)

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('value', 'Submit')

    authorizeForm.append(userNameLabel);
    authorizeForm.append(submitButton);
    root.append(authorizeForm)

    submitButton.addEventListener('click', () => {
        messageService.authorize(userNameInput.value)
    })
}

const application = (function({applicationClass = '', messageService}) {
    const root = document.querySelector(applicationClass);

    function selectUserState(users = []) {
            const isCanStartChat = users.length > 2;

            if(isCanStartChat) {
                massagerRender(root)
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

function paintMessages(messages) {
    const messageContainer = document.querySelector('.messages');
    messageContainer.innerHTML = null;

    messages.map(message => {
        const messageBubble = document.createElement('div');
        messageBubble.innerHTML = message;
        messageContainer.append(messageBubble)
    })
}

messageService.subscribeOnMessages(paintMessages);

const addButton = document.querySelector('.addButton');
const messageBody = document.querySelector('.message-body');

addButton.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    messageService.send(messageBody.value)
    messageBody.value = null;
})

// < textarea
// className = "message-body" > < /textarea>
// <input type="button" className="addButton" value="Add message"/>

// < div
// className = "messages" > < /div>
// <div className="control">
// </div>