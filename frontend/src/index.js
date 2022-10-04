import React from 'react'
import ReactDOM from 'react-dom'
import { BaseRouter } from './routes'
import WebSocketInstance from './websocket'
import {BrowserRouter as Router } from "react-router-dom"
import SidePanel from './containers/sidepanel/sidepanel'
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import reducer from './store/reducers/auth';
import thunk from 'redux-thunk';
import 'antd/dist/antd.css';

const store = createStore( reducer, applyMiddleware(thunk))

class App extends React.Component {

    componentDidMount() {
        WebSocketInstance.connect();
    }

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