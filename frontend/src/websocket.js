class WebSocketService {

    static instance = null;

    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        
        return WebSocketService.instance
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chatId) {
        const path = `ws://127.0.0.1:8000/ws/chat/${chatId}/`
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen= () => {
            console.log('websoket open')
        }
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data)
        }
        this.socketRef.onerror = e => {
            console.log(e.message)
        }
        this.socketRef.onclose = () => {
            console.log('socket is closed')
            this.connect(chatId);
        }
    }
    socketNewMessage(data) {
        const parseData = JSON.parse(data);
        const command = parseData.command;
        console.log(command, 'command')
        console.log(parseData)
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "messages") {
            this.callbacks[command](parseData.messages);
        }
        if (command === "new_message"){
            this.callbacks[command](parseData.message);
        }
    }

    fetchMessages(username, chatId) {
        this.sendMessage({command: 'fetch_messages', username: username, chatId: chatId})
    }

    newChatMessage(message) {
        this.sendMessage({command: 'new_message', from: message.from, message: message.content})
    }

    addCallbacks(messageCallback, newMessageCallback) {
        this.callbacks['messages'] = messageCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({...data}))
        } catch(err) {
            console.log(err.message)
        }
    }

    state() {
        return this.socketRef.readyState
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;