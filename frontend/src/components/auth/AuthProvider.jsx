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
            console.debug("Refreshing token")
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
        const tokenRefreshedByDifferentTab = !localStorage.getItem("accessToken") ? false :
            accessToken !== localStorage.getItem("accessToken");
        let switchedTokenExpiration = null;
        let newToken = null;

        if (tokenRefreshedByDifferentTab) {
            newToken = localStorage.getItem("accessToken");
            const {expirationTime: exp} = decodeToken(newToken);
            switchedTokenExpiration = exp;
            dispatch(tokenSwitchedByAnotherTabAction(newToken, exp));
        }

        const tokenExpired = tokenRefreshedByDifferentTab ? isTokenOutdated(switchedTokenExpiration)
            : isTokenOutdated(expirationTime);
        const refreshPresent = cookieExists("AUTHENTICATED");

        const currentToken = tokenRefreshedByDifferentTab ? newToken : accessToken;

        return {tokenExpired, refreshPresent, currentToken};
    }

    axios.interceptors.request.use(async request => {
        const {tokenExpired, refreshPresent, currentToken} = checkIfAnotherTabRefreshedToken();

        const tokenMissingInLocalStorage = !localStorage.getItem("accessToken");
        if ((tokenExpired && !refreshPresent) || tokenMissingInLocalStorage) {
            console.log("Cancelled with token expired", tokenExpired,
                "refreshPresent", refreshPresent, "token missing in local storage", tokenMissingInLocalStorage);
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
