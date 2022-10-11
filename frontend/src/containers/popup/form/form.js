import { Select } from 'antd';
import React from 'react';
import {connect} from "react-redux"
import {getUsersAPI, setMarkUsers} from "./../../../store/actions/actionCreateChat"
const { Option } = Select;




class FormUsers extends React.Component {

    componentDidMount() {
        this.props.getUsers();
    }

    handleChange(value)  {
        this.props.changeUsers(value)
      };

    render() {
        let children = this.props.allUsers.map((elem) => {
            return (
                <Option key={elem}>{elem}</Option>
            );
        })
       return (
            <>
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                onChange={this.handleChange.bind(this)}
                value={this.props.allMarkUsers}
              >
                {children}
              </Select>
            </>
          );
    } 

}

const mapStateToProps = (state) => {
    return {
        allUsers: state.createChatReducer.allUsers,
        allMarkUsers: state.createChatReducer.allMarkUsers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeUsers: (users) => dispatch(setMarkUsers(users)),
        getUsers: () => dispatch(getUsersAPI()) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormUsers);
