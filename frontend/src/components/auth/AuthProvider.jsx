import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {decodeToken, isTokenOutdated} from "../../utils/JwtTokenUtils";
import axios from "axios";
import {cookieExists} from "../../utils/CookieUtils";
import {REFRESH_FAILED} from "../../redux/AuthStore";
import {refreshAction, tokenSwitchedByAnotherTabAction} from "../../redux/AuthActions";

const AuthProvider = () => {

    const {accessToken, expirationTime} = useSelector(state => {
        return state.auth
    });
    const dispatch = useDispatch();

    let authTokenRequest;

    const resetAuthTokenRequest = () => {
        authTokenRequest = null;
    }

    async function getAuthToken() {
        if (!authTokenRequest) {
            authTokenRequest = dispatch(refreshAction());
            authTokenRequest.then(resp => {
                resetAuthTokenRequest();
                return resp;
            })
        }
        return authTokenRequest;
    }

    const abortSignal = (ogRequest) => {
        const controller = new AbortController();
        controller.abort("Nastąpiło wylogowanie");
        dispatch({type: REFRESH_FAILED, error: "Nastąpiło wylogowanie"});
        console.log("Cancelling", ogRequest)

        return {
            ...ogRequest,
            signal: controller.signal
        }
    }

    if (axios.interceptors.request.handlers.length > 0) {
        axios.interceptors.request.eject(axios.interceptors.request.handlers.length - 1);
    }

    const checkIfAnotherTabRefreshedToken = () => {
        const tokenIsPresentInStorage = localStorage.getItem("accessToken");
        const tokenRefreshedByDifferentTab = tokenIsPresentInStorage ? accessToken
            !== localStorage.getItem("accessToken") : false;

        let newToken = null;

        const refreshPresent = cookieExists("AUTHENTICATED");

        if (tokenRefreshedByDifferentTab) {
            console.log("Token was refreshed in a different tab");
            newToken = localStorage.getItem("accessToken");
            const {expirationTime: switchedTokenExpiration} = decodeToken(newToken);
            dispatch(tokenSwitchedByAnotherTabAction(newToken, switchedTokenExpiration));

            const tokenExpired = isTokenOutdated(switchedTokenExpiration);
            return {tokenExpired, refreshPresent, currentToken: newToken};
        } else {
            const tokenExpired = isTokenOutdated(expirationTime);
            return {tokenExpired, refreshPresent, currentToken: accessToken};
        }
    }

    axios.interceptors.request.use(async request => {
        const {tokenExpired, refreshPresent, currentToken} = checkIfAnotherTabRefreshedToken();

        if (tokenExpired && !refreshPresent) {
            console.log("Cancelled with token expired, refresh is not present", tokenExpired,
                "refreshPresent", refreshPresent);
            return abortSignal(request);
        }

        if (tokenExpired && refreshPresent) {
            console.log("Attempting token refresh");
            const result = await getAuthToken()
                .then((payload) => {
                    return payload;
                }).catch((e) => {
                    console.error('Refresh unsuccessful', e);
                    return {
                        abort: true
                    }
                })

            if (result.abort) {
                return abortSignal(request);
            }

            if (result) {
                console.log("Refresh successful")
                request.headers['Authorization'] = `Bearer ${result.authToken}`;
            }
            console.log("No refresh result")
        }

        if (!request.headers['Authorization'] && accessToken) {
            request.headers['Authorization'] = `Bearer ${currentToken}`;
        }

        return request;

    })
    axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    axios.defaults.withCredentials = true;

    return <></>;

};

export default AuthProvider;
