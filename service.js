export class Message {
  constructor(id, user, message) {
    this.id = id;
    this.message = message;
    this.user = user;
  }
}

export async function sendRequest(address, endpoint, body) {
  const response = await fetch(`${address}/${endpoint}`, body);
  return await response.json();
}

export function carriedRequest(address, endpoint) {
  return async (body) => await sendRequest(address, endpoint, body);
}

export function updateMessage(newMessages, store) {
  store.messageHistory = newMessages;
}

export function carriedStore(store) {
  return (data) => updateMessage(data, store);
}

export default function createMessageService(serverAddress) {
  const POOLING_INTERVAL = 1000;
  const MESSAGE_ENDPOINT = "messages";
  const messageStore = {
    currentUser: null,
    messageHistory: [],
  };
  const messageSubscriptions = [];
  const userSubscriptions = [];

  const carriedData = carriedRequest(serverAddress, MESSAGE_ENDPOINT);

  function recallMessageSubscriptions() {
    messageSubscriptions.map((callback) => callback(messageStore));
  }

  function recallUserSubscriptions() {
    userSubscriptions.map((callback) => callback(messageStore.currentUser));
  }
  const updateStore = carriedStore(messageStore);

  async function getMessages() {
    const messages = await carriedData();
    updateStore(messages);
    recallMessageSubscriptions();
  }

  async function sendMessages(message) {
    const messages = await carriedData({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
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
      await sendMessages(message);
    },
    subscribeOnMessages: (callback) => {
      messageSubscriptions.push(callback);
      callback(messageStore);
    },
  };
}
