import {AUTHENTICATE, LOGOUT} from '../actions/auth'

const inititalState = {
    token: null,
    userId: null
}

const authReducer = (state = inititalState, action) => {
    switch (action.type) {
        case AUTHENTICATE: {
            return {
                token: action.token,
                userId: action.userId
            }
        }
        case LOGOUT: {
            return inititalState
        }
        default: {
            return {...state};
        }
    }
}

export default authReducer