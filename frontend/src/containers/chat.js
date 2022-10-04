import React from "react";
import SidePanel from "./sidepanel/sidepanel";
import WebSocketInstance from "../websocket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this));
            WebSocketInstance.fetchMessages(this.props.currentUser);
        })

    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function() {
                if ( WebSocketInstance.state() === 1) {
                    console.log('connect is made')
                    callback()
                    return;
                } else {
                    console.log('waiting for connection...');
                    component.waitForSocketConnection(callback);
                }
            }, 100
        )
    }

    addMessage(message) {
        this.setState({messages: [...this.state.messages, message]})
    }

    setMessages(messages) {
        this.setState({messages: messages})
    } 

    messageChangeHandler = (event) => {
        this.setState({message: event.target.value})
    }

    sendMessageHandler = (e) => {
        e.preventDefault();
        
        const messageObject = {
            from: 'admin',
            content: this.state.message,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({message: ''})
    }

    renderMessages = (messages) => {
        const currentUser = 'admin';
        return messages.map((message, i)=>(
            <li
                key = {message.id}
                className={currentUser === message.author ? 'sent' : 'replies' }>
                <img src='data:image/jpeg;base64,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' />
                <p>{message.content}
                    <br/>
                    <small className={message.author === currentUser? 'sent': 'replies'}>
                        15 minutes ago
                    </small>
                </p>
            </li>
        ))
    }

    render() {
        const messages = this.state.messages
        return (   
        <div className="content">
            <div className="contact-profile">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p>Harvey Specter</p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                     <i className="fa fa-instagram" aria-hidden="true"></i>
                </div>
            </div>
            <div className="messages">
                <ul id="chat-log">
                {
                    messages && this.renderMessages(messages)    
                }
                </ul>
            </div>
            <div className="message-input">
                <form onSubmit={this.sendMessageHandler}>
                    <div className="wrap">
                        <input 
                            onChange={this.messageChangeHandler}
                            value={this.state.message}
                            required
                            type="text" 
                            id="chat-message-input" 
                            placeholder="Write your message..."
                             />
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button className="submit" id="chat-message-submit">
                            <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
    }
}

export default Chat;