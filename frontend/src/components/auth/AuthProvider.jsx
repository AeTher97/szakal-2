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
        const tokenRefreshedByDifferentTab = !tokenIsPresentInStorage ? false :
            accessToken !== localStorage.getItem("accessToken");

        let newToken = null;

        const refreshPresent = cookieExists("AUTHENTICATED");

        if (tokenRefreshedByDifferentTab) {
            console.debug("Token was refreshed in a different tab");
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
            console.debug("Cancelled with token expired", tokenExpired,
                "refreshPresent", refreshPresent);
            return abortSignal(request);
        }

        if (tokenExpired && refreshPresent) {
            console.debug("Attempting token refresh");
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
                request.headers['Authorization'] = `Bearer ${result.authToken}`;
            }
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
