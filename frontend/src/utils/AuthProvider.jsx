import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {isTokenOutdated} from "./TokenUtils";
import axios from "axios";
import {refreshAction} from "../redux/ReducerActions";

const AuthProvider = () => {

    const {accessToken, expirationTime, isAuthenticated} = useSelector(state => {
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

    if (axios.interceptors.request.handlers.length > 0) {
        axios.interceptors.request.eject(axios.interceptors.request.handlers.length - 1);
    }

    axios.interceptors.request.use(async request => {

        const tokenExpired = expirationTime && isTokenOutdated(expirationTime);
        const refreshPresent = !expirationTime && isAuthenticated;

        console.debug(expirationTime, isTokenOutdated(expirationTime), refreshPresent)
        if (tokenExpired || refreshPresent) {
            console.info("Refreshing token");
            const result = await getAuthToken()
                .then((payload) => {
                    return payload;
                }).catch((e) => {
                    console.error('Error in refresh', e);
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
    axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    axios.defaults.withCredentials = true;

    return (<></>);

};

export default AuthProvider;
