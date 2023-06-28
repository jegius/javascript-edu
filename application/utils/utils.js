export async function sendRequest(address, endpoint, body) {
    const response = await fetch(`${address}/${endpoint}`, body);
    return await response.json();
}

export function carriedRequest(address, endpoint) {
    return async (body) => await sendRequest(address, endpoint, body);
}

export function updateMessage(newMessages, store) {
    store.messageHistory = newMessages
}

export function carriedStore(store) {
    return (data) => updateMessage(data, store);
}
