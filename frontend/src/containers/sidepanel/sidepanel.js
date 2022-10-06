import React from "react";
import { connect } from "react-redux";
import * as actions from "./../../store/actions/auth";
import {Spin, Icon} from 'antd';
import Profiles from "./contacts/contacts";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>

class SidePanel extends React.Component {
    
    state = {
        loginForm: true,
    }

    authenticate = (e) =>  {
        e.preventDefault();
        if (this.state.loginForm) {
            this.props.login(
            e.target.username.value,
            e.target.password.value
            )
        } else {
            this.props.signup(
                e.target.username.value,
                e.target.email.value,
                e.target.password1.value,
                e.target.password2.value
            )
        }
    }

    changeFrom = (e) => {
        this.setState({loginForm: !this.state.loginForm})
    }


    componentDidMount() {
        this.props.getContacts()
    }

    render() {
        return (
            <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                    <p>Mike Ross</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        {   this.props.loading?
                            <Spin size="large" style={{width: "100%"}}/>:
                            this.props.isAuthnticated?
                            <button onClick={()=> this.props.logout()}> <span>logout</span></button>:
                            <div>
                            <form method="POST" onSubmit={this.authenticate}>
                                {
                                    this.state.loginForm?
                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="password" type="text" placeholder="password" />
                                    </div>
                                    :
                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="email" type="text" placeholder="email" />
                                        <input name="password1" type="text" placeholder="password" />
                                        <input name="password2" type="text" placeholder="confime password" />
                                    </div>
                                }
                                <button type="submit"> Authenticate </button>
                            </form>
                            <button onClick={this.changeFrom}>{this.state.loginForm?'Sign Up': 'Sign In'}</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    {this.props.contacts.map( e =>  <Profiles key={e.id} url={e.id} /> )}
                </ul>
            </div>
            <div id="bottom-bar">
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div>
        </div>    
        )
    }
}


const mapStateToProps = state => ({
    isAuthnticated : state.token !== null,
    loading: state.loading,
    contacts: state.contacts,
})

const mapDispatchToProps = dispatch => ({
    login: (username, password) => dispatch(actions.authLogin(username, password)),
    logout: ()=> { 
            dispatch(actions.logout());
            dispatch(actions.getContacts());
        },
    signup: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)),
    getContacts : (username=null, token=null) => dispatch(actions.getContacts(username, token))
})


export default connect(mapStateToProps,mapDispatchToProps )(SidePanel);