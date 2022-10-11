import { Button, Modal, Spin } from 'antd';
import React from 'react';
import {connect} from "react-redux";
import {setIsVisible, setMarkUsers, createChatAPI} from "./../../store/actions/actionCreateChat"
import FormUsers from "./form/form";

class AddChatModel extends React.Component {
  

  setVisible(isVisible) {
    this.props.setIsVisible(isVisible) 
  }

  offPopup() {
    this.props.setIsVisible(false)
    this.props.clearMarkUsers()
  }

  createChat() {
    if (this.props.allMarkUsers.length !== 0 ) {
      this.props.createChat([...this.props.allMarkUsers, this.props.username])
      this.props.setIsVisible(false)
      this.props.clearMarkUsers()
    }
  }

  render() {

    return (
      <>
        <button type="primary" onClick={ () => this.setVisible(true)}>
          <i className="fa fa-user-plus fa-fw" aria-hidden="true">
            </i> 
            <span>
              Add contact
            </span>
        </button>
        <Modal
          title="Vertically centered modal dialog"
          centered
          visible={this.props.isVisible}
          onOk={this.createChat.bind(this)}
          onCancel={this.offPopup.bind(this)}
        > 
          {
            this.props.isLoading?
            <Spin size="large" style={{width: "100%"}}/>:
            <FormUsers />
          }
        </Modal>
      </>
    );
  }
  
};

const mapStateToProps = (state) => {
  return {
    isVisible: state.createChatReducer.isVisible,
    isLoading: state.createChatReducer.isLoading,
    username: state.authReducer.username,
    allMarkUsers: state.createChatReducer.allMarkUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsVisible: (isVisible) => dispatch(setIsVisible(isVisible)),
    clearMarkUsers: () => dispatch(setMarkUsers([])),
    createChat: (users) => dispatch(createChatAPI(users))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddChatModel);