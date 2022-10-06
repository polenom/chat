import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (username, token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('expirationDate')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const Contacts = (contacts) => {
    return {
        type: actionTypes.AUTH_CONTACTS,
        contacts,
    }
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {dispatch(logout())}, expirationTime * 3600)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {        
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: username,
            password: password
        })
        .then( res => {
            const token= res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(username, token))
            dispatch(checkAuthTimeout(3600))
            getContacts(username, token)(dispatch)
        })
        .catch( err => { dispatch(authFail(err))})
    }
}

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
            username,
            email,
            password1,
            password2
        })
        .then(res => {
            const token= res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(username, token))
            getContacts(username, token)(dispatch)
            dispatch(checkAuthTimeout(3600))
        })
        .catch( err => {
            dispatch(authFail(err))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if ( token === undefined ) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date() ) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token));
                getContacts(localStorage.getItem('username'), token)(dispatch);
                dispatch(checkAuthTimeout((expirationDate - new Date())/ 1000));
            }
        }
    }
}

export const getContacts = (username, token) => {
    return dispatch => {
        let url = 'http://127.0.0.1:8000/chat/' ;
        if (username !== null && username !== undefined ) {
            url += `?username=${username}`
        }
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: (token === null || token === undefined)?'':`Token ${token}`
        }
        console.log('token' ,  localStorage.getItem('token'))
        axios.get(url)
        .then(res  => {
                console.log('contacts ', res.data ) 
                dispatch(Contacts(res.data))
            })
            .catch(
                err => 
                dispatch(Contacts([]))
            )
    }
}