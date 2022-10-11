
import { updateObject } from "../utilities/stateutility";
import * as actionTypes from "../actions/actionTypes";



const initialState = {
    token: null,
    username: null,
    error: null,
    loading: false,
    contacts: []
}


const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    })
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        username: action.username,
        error: null,
        loading: false
    })
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const authLogout = (state) => {
    return updateObject(state, {
        token: null,
        username: null,
        error: null,
        loading: false,
        contacts: [],
    })
}

const getContacts = (state, action) => {
    return updateObject(state, {
        contacts: action.contacts,
    }) 
}

const authReducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_CONTACTS: return getContacts(state, action);
        default: return state;
    } 
}

export default authReducer;