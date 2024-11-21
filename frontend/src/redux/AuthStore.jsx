import {clearLocalStorage, decodeToken, saveAccessRightsInStorage, saveInfoInStorage} from "../utils/JwtTokenUtils";
import {cookieExists} from "../utils/CookieUtils";

export const LOGIN_ATTEMPT = "LOGIN_ATTEMPT";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGIN_FAILED = "LOGIN_FAILED";

export const REFRESH_ATTEMPT = "REFRESH_ATTEMPT";

export const REFRESH_SUCCESS = "REFRESH_SUCCESS";
export const UPDATE_ACCESS_RIGHTS = "UPDATE_ACCESS_RIGHTS";

export const REFRESH_FAILED = "REFRESH_FAILED";

export const LOGOUT = "LOGOUT";

export const REFRESH = "REFRESH";
export const TOKEN_SWITCHED_BY_ANOTHER_TAB = "TOKEN_SWITCHED_BY_ANOTHER_TAB";


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

export function authReducer(state = initialState, action) {
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