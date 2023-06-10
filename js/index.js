const messageService = (function () {
    const messageStore = ['test message', 'test message', 'test message'];
    const callbackStore = [];

    return {
        send: (message) => {
            messageStore.push(message);
            callbackStore.map(callback => callback(messageStore))

        },
        subscribe: (callback) => {
            callbackStore.push(callback);
            callback(messageStore);
        }
    }
})()


function paintMessages(messages) {
    const messageContainer = document.querySelector('.messages');
    messageContainer.innerHTML = null;

    messages.map(message => {
        const messageBubble = document.createElement('div');
        messageBubble.innerHTML = message;
        messageContainer.append(messageBubble)
    })
}

// hello, it's example changes

messageService.subscribe(paintMessages);

const addButton = document.querySelector('.addButton');
const messageBody = document.querySelector('.message-body');

addButton.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    messageService.send(messageBody.value)
    messageBody.value = null;
})
