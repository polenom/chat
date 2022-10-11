import React from 'react'
import BaseRouter from './routes'
import ReactDOM from 'react-dom'
import WebSocketInstance from './websocket'
import {BrowserRouter as Router } from "react-router-dom"
import SidePanel from './containers/sidepanel/sidepanel'
import {Provider} from "react-redux";
import {applyMiddleware, createStore, combineReducers} from "redux";
import authReducer from './store/reducers/auth';
import thunk from 'redux-thunk';
import 'antd/dist/antd.css';
import createChatReducer from "./store/reducers/createChat"

let allReducer = combineReducers({
    authReducer,
    createChatReducer
})

const store = createStore( allReducer, applyMiddleware(thunk))

class App extends React.Component {


    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div id="frame">
                        <SidePanel />
                        <BaseRouter />
                    </div>
                </Router>
            </Provider>
        )
    };
};

ReactDOM.render(<App />, document.getElementById("app"))