class WebSocketService {

    isReconnect = true;

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
        
        const path = `ws://93.125.42.237:8000/ws/chat/${chatId}/`
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen= () => {
            console.log('websoket open, chatid :', chatId)
        }
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data)
        }
        this.socketRef.onerror = e => {
            console.log(e.message)
        }
        this.socketRef.onclose = (a) => {
            console.log('socket is closed', this.isReconnect)
            if (this.isReconnect) {
                setTimeout(()=>{
                    this.connect(chatId)
                }, 1000)
            }
            this.isReconnect = true
        }
    }
    socketNewMessage(data) {
        const parseData = JSON.parse(data);
        const command = parseData.command;
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
        console.log(message)
        this.sendMessage({command: 'new_message', from: message.from, message: message.content, chatid: message.chatid })
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

    close(reconect = false ) {
        this.isReconnect = reconect
        this.socketRef.close()
    }

    state() {
        return this.socketRef.readyState
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;