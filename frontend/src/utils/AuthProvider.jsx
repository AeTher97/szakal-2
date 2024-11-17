import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {isTokenOutdated} from "./TokenUtils";
import {defaultAxiosInstance, refreshAction} from "../redux/ReducerActions";

const AuthProvider = () => {

    let authTokenRequest;

    function resetAuthTokenRequest() {
        authTokenRequest = null;
    }


    const {accessToken, expirationTime, isAuthenticated} = useSelector(state => {
        return state.auth
    });
    const dispatch = useDispatch();


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

    if (defaultAxiosInstance.interceptors.request.handlers.length > 0) {
        defaultAxiosInstance.interceptors.request.eject(defaultAxiosInstance.interceptors.request.handlers.length - 1);
    }

    defaultAxiosInstance.interceptors.request.use(async request => {

        const tokenExpired = expirationTime && isTokenOutdated(expirationTime);
        const tokenRemovedButRefreshPresent = !accessToken && isAuthenticated;
        const currentlyRefreshing = request.url === "/refresh";

        // Don't stop this request on refresh
        if ((tokenExpired || tokenRemovedButRefreshPresent) && !currentlyRefreshing) {
            console.info("Refreshing token");
            const result = await getAuthToken()
                .then((payload) => {
                    return payload;
                }).catch(() => {
                    console.error('Error in refresh');
                    return null;
                })

            if (result) {
                request.headers['Authorization'] = `Bearer ${result.authToken}`;
            }
        }

        if (!request.headers['Authorization'] && accessToken) {
            request.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return request;

    })


    return (<></>);

};

export default AuthProvider;
