import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {decodeToken, isTokenOutdated, saveAccessRightsInStorage, saveTokenInStorage} from "../utils/TokenUtils";
import alertReducer from "./AlertReducer";

export const LOGIN_ATTEMPT = "LOGIN_ATTEMPT"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

export const LOGIN_FAILED = "LOGIN_FAILED"

export const REFRESH_ATTEMPT = "REFRESH_ATTEMPT"

export const REFRESH_SUCCESS = "REFRESH_SUCCESS"
export const UPDATE_ACCESS_RIGHTS = "UPDATE_ACCESS_RIGHTS"

export const REFRESH_FAILED = "REFRESH_FAILED"

export const LOGOUT = "LOGOUT"
export const SWITCH_THEME = "SWITCH_THEME"
export const SWITCH_CAMPAIGN = "SWITCH_CAMPAIGN"
export const ADD_ITEM = "ADD_ITEM"
export const REMOVE_ITEM = "REMOVE_ITEM"

const getAuthFromStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const surname = localStorage.getItem("surname");
    const accessRights = localStorage.getItem("accessRights") ? localStorage.getItem("accessRights").split(",") : [];


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
                accessRights: accessRights,
                isAuthenticated: true,
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
    localStorage.removeItem("name")
    localStorage.removeItem("surname")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("accessRights")
}

const emptyState = {
    userId: null,
    roles: null,
    accessToken: null,
    refreshToken: null,
    accessRights: [],
    expirationTime: null,
    isAuthenticated: false,
    error: null,
    email: null,
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
            saveTokenInStorage(action.payload.accessToken, state.refreshToken, action.payload.userId, action.payload.email, action.payload.name, action.payload.surname)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                error: null,
            }
        case UPDATE_ACCESS_RIGHTS:
            saveAccessRightsInStorage(action.payload.accessRights)
            return {
                ...state,
                accessRights: action.payload.accessRights
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

const getThemeFromStorage = () => {
    return localStorage.getItem("joy-mode") === "light" ? "light" : "dark";
}

const themeInitialState = {
    theme: getThemeFromStorage()
};

function themeReducer(state = themeInitialState, action) {
    switch (action.type) {
        case SWITCH_THEME:
            return {
                theme: state.theme === "light" ? "dark" : "light"
            }
        default:
            return state;

    }
}

function campaignReducer(state = {currentCampaign: ""}, action) {
    switch (action.type) {
        case SWITCH_CAMPAIGN:
            return {
                currentCampaign: action.payload.currentCampaign
            }
        default:
            return state;

    }
}

function knownItemReducer(state = {items: []}, action) {
    switch (action.type) {
        case ADD_ITEM:
            return {
                items: [...state.items, action.payload.item]
            }
        case REMOVE_ITEM:
            const newItems = state.items.filter(item => item.id !== action.payload.item.id)
            return {
                items: newItems
            }
        default:
            return state;

    }
}


export let stores = configureStore({
    reducer: combineReducers(
        {
            auth: authReducer,
            theme: themeReducer, campaigns: campaignReducer,
            knownItems: knownItemReducer,
            alert: alertReducer
        })
});
