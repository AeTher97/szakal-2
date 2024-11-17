import {
    ADD_FAVOURITE_JOURNEY,
    ADD_ITEM,
    LOAD_FAVOURITE_JOURNEYS,
    LOGIN_ATTEMPT,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT,
    REFRESH,
    REFRESH_ATTEMPT,
    REFRESH_FAILED,
    REFRESH_SUCCESS,
    REMOVE_FAVOURITE_JOURNEY,
    REMOVE_ITEM,
    SWITCH_CAMPAIGN,
    SWITCH_THEME,
    UPDATE_ACCESS_RIGHTS
} from "./Stores";
import axios from "axios";
import {decodeToken, saveInfoInStorage} from "../utils/TokenUtils";
import {showError} from "./AlertActions";

const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const defaultAxiosInstance = axios.create(
    {
        baseURL: baseURL,
        withCredentials: true
    }
)

const updateAccessRights = (user, authToken, dispatch) => {
    return defaultAxiosInstance.get("/roles", {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then((res) => {
        const userAccessRights = res.data
            .filter(role => user.roles.includes(role.id))
            .flatMap(role => {
                return role.accessRights.map(accessRight => accessRight.code);
            })
        const uniqueAccessRights = [...new Set(userAccessRights)];
        dispatch(setAccessRightsAction(uniqueAccessRights))
    })
}

export const loginAction = ({username, password}, onSuccessCallback = () => null) => dispatch => {
    dispatch({type: LOGIN_ATTEMPT});

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);


    return defaultAxiosInstance.post('/login', formData)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken
            };

            dispatch({type: LOGIN_SUCCESS, payload: payload});
            const user = decodeToken(data.authToken);
            saveInfoInStorage(data.authToken, payload.userId, user.email, user.name, user.surname);
            onSuccessCallback({accepted: data.accepted, authToken: data.authToken});
            updateAccessRights(user, data.authToken, dispatch)
            return data.accepted
        })
        .catch(err => {
            console.error('Login unsuccessful');
            console.error(err.response)
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                dispatch({type: LOGIN_FAILED, error: "Invalid username or password"});
                dispatch(showError("Nieprawidłowy email lub hasło"));
            } else dispatch(showError(err.message))
        });
};

export const refreshAction = (onSuccessCallback = () => null) => dispatch => {
    dispatch({type: REFRESH_ATTEMPT});

    return defaultAxiosInstance.post('/refresh', null)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken,
            };

            dispatch({type: REFRESH_SUCCESS, payload: payload});
            onSuccessCallback(data.authToken, data.refreshToken);
            updateAccessRights(decodeToken(data.authToken), data.authToken, dispatch)
            return data;
        })
        .catch(err => {
            console.error('Refresh unsuccessful');
            dispatch({type: REFRESH_FAILED, error: "Nastąpiło wylogowanie"});
        });
};

export const setAccessRightsAction = (accessRights) => dispatch => {
    dispatch({type: UPDATE_ACCESS_RIGHTS, payload: {accessRights}})
}

export const logoutAction = () => dispatch => {
    dispatch({type: LOGOUT});
}

export const changeThemeAction = () => dispatch => {
    dispatch({type: SWITCH_THEME});
}

export const changeCampaignAction = (campaignId) => dispatch => {
    dispatch({type: SWITCH_CAMPAIGN, payload: {currentCampaign: campaignId}});
}

export const addKnownItem = (itemId, itemName) => dispatch => {
    dispatch({type: ADD_ITEM, payload: {item: {id: itemId, name: itemName}}});
}

export const removeKnownItem = (itemId) => dispatch => {
    dispatch({type: REMOVE_ITEM, payload: {item: {id: itemId}}});
}

export const reloadAction = () => dispatch => {
    dispatch({type: REFRESH})
}

export const loadFavouriteJourneysAction = (authToken) => dispatch => {
    return axios.get("/favouriteJourneys", {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then((res) => {
        dispatch({type: LOAD_FAVOURITE_JOURNEYS, payload: {items: res.data}})
    }).catch(e => {
        dispatch(showError(e.message));
    })
}

export const addFavouriteJourney = (journeyId) => dispatch => {
    axios.post("/favouriteJourneys", {
        journeyId: journeyId
    }).then((res) => {
        dispatch({type: ADD_FAVOURITE_JOURNEY, payload: {item: res.data}});
    }).catch(e => {
        dispatch(showError(e.message));
    })
}

export const removeFavouriteJourney = (journeyId) => dispatch => {
    axios.delete(`/favouriteJourneys/${journeyId}`)
        .then((_) => {
            dispatch({type: REMOVE_FAVOURITE_JOURNEY, payload: {item: {id: journeyId}}})
        }).catch(e => {
        dispatch(showError(e.message));
    })
}