import {
    ADD_ITEM,
    LOGIN_ATTEMPT,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT,
    REFRESH_ATTEMPT,
    REFRESH_FAILED,
    REFRESH_SUCCESS,
    REMOVE_ITEM,
    SWITCH_CAMPAIGN,
    SWITCH_THEME,
    UPDATE_ACCESS_RIGHTS
} from "./Stores";
import axios from "axios";
import {decodeToken, saveTokenInStorage} from "../utils/TokenUtils";
import {showError} from "./AlertActions";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create(
    {baseURL: baseURL}
)

const updateAccessRights = (user, authToken, dispatch) => {
    return axiosInstance.get("/roles?pageNumber=0", {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then((res) => {
        const userAccessRights = res.data.content
            .filter(role => user.roles.includes(role.name))
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


    return axiosInstance.post('/login', formData)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken,
                refreshToken: data.refreshToken
            };

            dispatch({type: LOGIN_SUCCESS, payload: payload});
            const user = decodeToken(data.authToken);
            saveTokenInStorage(data.authToken, data.refreshToken, payload.userId, user.email, user.name, user.surname);
            onSuccessCallback(data.accepted);
            updateAccessRights(user, data.authToken, dispatch)
            return data.accepted
        })
        .catch(err => {
            console.error('Login unsuccessful');
            dispatch({type: LOGIN_FAILED, error: "Invalid username or password"});
            dispatch(showError("Nieprawidłowy email lub hasło"));
        });
};

export const refreshAction = (refreshToken, onSuccessCallback = () => null) => dispatch => {
    dispatch({type: REFRESH_ATTEMPT});

    let formData = new FormData();
    formData.append('refreshToken', refreshToken);


    return axiosInstance.post('/refresh', formData)
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