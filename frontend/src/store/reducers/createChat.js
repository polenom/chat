
import { updateObject } from "../utilities/stateutility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
    isVisible: false,
    allUsers: [],
    allMarkUsers: [],
    isLoading: false
}

const setIsVisible = (state, action) => {
    return updateObject(state, {
        isVisible: action.isVisible,
    }) 
}

const setAllMarkUsers = (state, action) => {
    return updateObject(state, {
        allMarkUsers: action.allMarkUsers,
    })
}

const setAllUsers = (state, action) => {
    return updateObject(state , {
        allUsers: action.allUsers
    })
}

const createChatReducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_VISIBLE_POPUP: return setIsVisible(state, action)
        case actionTypes.SET_MARK_USERS: return setAllMarkUsers(state, action)
        case actionTypes.SET_USERS: return setAllUsers(state, action)
        default: return state;
    } 
}

export default createChatReducer;