import {carriedRequest, carriedStore} from "../utils/utils.js";
import {API_URL} from "../consts.js";

export const messageService = (function (serverAddress) {
    const POOLING_INTERVAL = 1000;
    const MESSAGE_ENDPOINT = 'messages'
    const messageStore = {
        currentUser: null,
        messageHistory: []
    };
    const messageSubscriptions = [];

    const carriedData = carriedRequest(serverAddress, MESSAGE_ENDPOINT);

    function recallMessageSubscriptions() {
        messageSubscriptions.map(callback => callback(messageStore))
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
        send: async (message) => {
            await sendMessages(message)
        },
        subscribeOnMessages: (callback) => {
            messageSubscriptions.push(callback);
            callback(messageStore);
        }
    }
})(API_URL);