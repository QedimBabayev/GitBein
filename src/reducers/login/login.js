import {
    PUT_LOGIN_PENDING,
    PUT_LOGIN_FULFILLED,
    PUT_LOGIN_REJECTED,


} from '../../config/fetching';

const user = JSON.parse(localStorage.getItem("user"));
export const initialState = {
    fetching: false,
    token: '',
    login: '',
    isLoggedIn: user ? true : false
};
function login(state = initialState, action) {

    switch (action.type) {

        case PUT_LOGIN_PENDING:
            return {
                ...state,
                fetching: true,
                isLoggedIn: false,
            };

        case PUT_LOGIN_FULFILLED:
            console.log(action.payload)
            return {
                ...state,
                fetching: false,
                login: action.payload.Login,
                token: action.payload.Token,
                isLoggedIn: true,

            };
        case PUT_LOGIN_REJECTED:
            return {
                ...state,
                error: action.payload,
                isLoggedIn: false,


            };
        case 'DELETE_LOGIN':
            return {
                ...state,
                fetching: false,
                isLoggedIn: false,
                login: '',
                token: '',

            };
        default:
            return state;
    }

}

export default login