import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {clearLocalStorage, decodeToken, saveAccessRightsInStorage, saveInfoInStorage} from "../utils/TokenUtils";
import alertReducer from "./AlertReducer";
import {cookieExists} from "../utils/CookieUtils";

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
export const REFRESH = "REFRESH"
export const TOKEN_SWITCHED_BY_ANOTHER_TAB = "TOKEN_SWITCHED_BY_ANOTHER_TAB"

export const LOAD_FAVOURITE_JOURNEYS = "LOAD_JOURNEYS";
export const REMOVE_FAVOURITE_JOURNEY = "REMOVE_JOURNEY"
export const ADD_FAVOURITE_JOURNEY = "ADD_JOURNEY"

const getAuthFromStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const surname = localStorage.getItem("surname");
    const userId = localStorage.getItem("userId");
    const accessRights = localStorage.getItem("accessRights")?.split(",") || [];

    if (accessToken) {
        const result = decodeToken(accessToken);

        if (result.error) {
            return result;
        } else {
            return {
                ...result,
                accessToken: accessToken,
                accessRights: accessRights,
                isAuthenticated: true,
                name: name,
                surname: surname,
                email: email,
                error: null
            }
        }
    } else if (cookieExists("AUTHENTICATED")) {
        return {
            isAuthenticated: true,
            name: name,
            surname: surname,
            email: email,
            userId: userId,
            error: null
        }
    } else {
        return {
            isAuthenticated: false
        }
    }

};

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
    surname: null,
    refresh: 0
}

const initialState = {
    ...emptyState,
    ...getAuthFromStorage()
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
        case REFRESH_SUCCESS:
            saveInfoInStorage(
                action.payload.accessToken,
                action.payload.userId,
                action.payload.email,
                action.payload.name,
                action.payload.surname)
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
        case REFRESH:
            return {
                ...state,
                refresh: state.refresh + 1
            }
        case TOKEN_SWITCHED_BY_ANOTHER_TAB:
            return {
                ...state,
                accessToken: action.payload.accessToken,
                expirationTime: action.payload.expirationTime
            }
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

function favouriteJourneysReducer(state = {favouriteJourneys: []}, action) {
    switch (action.type) {
        case LOAD_FAVOURITE_JOURNEYS:
            return {
                favouriteJourneys: action.payload.items
            }
        case REMOVE_FAVOURITE_JOURNEY:
            const newItems = state.favouriteJourneys.filter(item => item.id !== action.payload.item.id)
            return {
                favouriteJourneys: newItems
            }
        case ADD_FAVOURITE_JOURNEY:
            return {
                favouriteJourneys: [...state.favouriteJourneys, action.payload.item]
            }
        default:
            return state;

    }
}


export const stores = configureStore({
    reducer: combineReducers(
        {
            auth: authReducer,
            theme: themeReducer,
            campaigns: campaignReducer,
            knownItems: knownItemReducer,
            alert: alertReducer,
            favouriteJourneys: favouriteJourneysReducer
        })
});
