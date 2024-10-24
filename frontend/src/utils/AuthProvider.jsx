import React from 'react';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {isTokenOutdated} from "./TokenUtils";
import {refreshAction} from "../redux/ReducerActions";

const AuthProvider = () => {

    let authTokenRequest;

    function resetAuthTokenRequest() {
        authTokenRequest = null;
    }


    const {refreshToken, accessToken, expirationTime} = useSelector(state => {
        return state.auth
    });
    const dispatch = useDispatch();


    async function getAuthToken() {
        if (!authTokenRequest) {
            authTokenRequest = dispatch(refreshAction(refreshToken));
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

        if (expirationTime && isTokenOutdated(expirationTime)) {
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

    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

    return (<></>);

};

export default AuthProvider;
