import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {decodeToken, isTokenOutdated, saveTokenInStorage} from "../utils/TokenUtils";

export const LOGIN_ATTEMPT = "LOGIN_ATTEMPT"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

export const LOGIN_FAILED = "LOGIN_FAILED"

export const REFRESH_ATTEMPT = "REFRESH_ATTEMPT"

export const REFRESH_SUCCESS = "REFRESH_SUCCESS"

export const REFRESH_FAILED = "REFRESH_FAILED"

export const LOGOUT = "LOGOUT"

const getAuthFromStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");
    const surname = localStorage.getItem("surname");


    if (accessToken) {
        const result = {...decodeToken(accessToken)};


        const refreshResult = {...decodeToken(refreshToken)}

        if (isTokenOutdated(refreshResult.expirationTime)) {
            return emptyState;
        }

        if (result.error || refreshResult.error) {
            return result;
        } else {
            return {
                ...result,
                accessToken: accessToken,
                refreshToken: refreshToken,
                isAuthenticated: true,
                username: username,
                name: name,
                surname: surname,
                email: email,
                error: null
            }
        }
    }

};

const clearLocalStorage = () => {
    localStorage.removeItem("email")
    localStorage.removeItem("username")
    localStorage.removeItem("name")
    localStorage.removeItem("surname")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessToken")
}

const emptyState = {
    userId: null,
    roles: null,
    accessToken: null,
    refreshToken: null,
    expirationTime: null,
    isAuthenticated: false,
    error: null,
    email: null,
    username: null,
    name: null,
    surname: null
}

const initialState = {
    ...emptyState,
    ...getAuthFromStorage()
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
        case REFRESH_SUCCESS:
            saveTokenInStorage(action.payload.accessToken, state.refreshToken, state.email, state.username)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                error: null,
            }
        case LOGIN_FAILED:
            clearLocalStorage();
            return {
                isAuthenticated: false,
                error: action.error,
            }
        case LOGIN_ATTEMPT: {
            return {
                ...emptyState,
                error: state.error
            }
        }
        case REFRESH_FAILED:
            clearLocalStorage();
            return {
                ...emptyState,
                error: action.error
            }
        case LOGOUT:
            clearLocalStorage();
            return emptyState;
        case REFRESH_ATTEMPT:
        default:
            return state;

    }
}

export let authStore = configureStore({
    reducer: combineReducers({auth: authReducer})
});
