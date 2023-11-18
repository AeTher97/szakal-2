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
import {decodeToken} from "../utils/TokenUtils";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create(
    {baseURL: baseURL}
)

export const loginAction = ({username, password}, onSuccessCallback = () => null) => dispatch => {
    dispatch({type: LOGIN_ATTEMPT});

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);


    axiosInstance.post('/login', formData)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken,
                refreshToken: data.refreshToken,
                username: username
            };

            dispatch({type: LOGIN_SUCCESS, payload: payload});
            onSuccessCallback(data.authToken, data.refreshToken, payload.email);
            axiosInstance.get("/roles?pageNumber=0", {
                headers: {
                    'Authorization': `Bearer ${data.authToken}`
                }
            }).then((res) => {
                const userAccessRights = res.data.content.map(role => {
                    return role.accessRights.map(accessRight => accessRight.code);
                })
                const uniqueAccessRights = [...new Set(userAccessRights)];
                dispatch(setAccessRightsAction(uniqueAccessRights))
            })
        })
        .catch(err => {
            console.error('Login unsuccessful');
            dispatch({type: LOGIN_FAILED, error: "Invalid username or password"});
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