import * as actionTypes from './actionTypes';
import axios from 'axios';
import { getContacts } from './auth';

export const setIsVisible = (is) => {
    return {
        type: actionTypes.SET_VISIBLE_POPUP,
        isVisible: is
    }
}

export const setMarkUsers = (users) => {
    return {
        type: actionTypes.SET_MARK_USERS,
        allMarkUsers: users
    }
}

export const setUsers = (users) => {
    return {
        type: actionTypes.SET_USERS,
        allUsers: users
    }
}


export const getUsersAPI = () => {
    return dispatch => {
        let username = localStorage.getItem('username')
        let url = 'http://127.0.0.1:8000/chat/users/'
        axios.get(url)
        .then(res => {
            dispatch(setUsers(res.data.users.filter(element => element !== username )))
        })
        .catch(err => console.log(err.message))
    }
}

export const createChatAPI = (users) => {
    return dispatch => {
        let url = 'http://127.0.0.1:8000/chat/create/'
        let token = localStorage.getItem('token');
        let username = localStorage.getItem('username');
        axios.post(url, {
            participants: users
        })
        .then(res => {
            getContacts(username, token)(dispatch)
        })
        .catch(err => console.log(err.message))
    }
}

