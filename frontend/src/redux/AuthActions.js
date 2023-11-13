import {
    LOGIN_ATTEMPT,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT,
    REFRESH_ATTEMPT,
    REFRESH_FAILED,
    REFRESH_SUCCESS
} from "./AuthStore";
import axios from "axios";
import {decodeToken} from "../utils/TokenUtils";

const baseURL = process.env.REACT_APP_BACKEND_URL;
console.log(baseURL)

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
            console.log("refreshed")

            dispatch({type: REFRESH_SUCCESS, payload: payload});
            onSuccessCallback(data.authToken, data.refreshToken);
            return data;
        })
        .catch(err => {
            console.error('Refresh unsuccessful');
            dispatch({type: REFRESH_FAILED, error: "Nastąpiło wylogowanie"});
        });
};

export const logoutAction = () => dispatch => {
    dispatch({type: LOGOUT});
}
