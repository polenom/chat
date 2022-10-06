import React from "react";
import { connect } from "react-redux";
import {Route, Routes} from "react-router-dom";
import Chat from "./containers/chat";
import * as actions from './store/actions/auth'


class BaseRouter extends React.Component {

    componentDidMount() {
        this.props.onTryAuth();
    }


    render() {
        return (
            <Routes>
                <Route path="/" element={<div > Helllllllll </div>}/>  
                <Route path="/chat/:chatID/" element={<Chat />}/>  
            </Routes>
            )  
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: () => dispatch(actions.authCheckState())
    }
}

export default connect(null,mapDispatchToProps)(BaseRouter)
