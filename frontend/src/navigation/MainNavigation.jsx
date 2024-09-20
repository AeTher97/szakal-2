import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import * as React from "react";
import AppContainer from "../screens/AppContainer";
import NotFoundScreen from "../screens/NotFoundScreen";
import NotAcceptedScreen from "../screens/NotAcceptedScreen";
import SecureRoute from "../utils/SecureRoute";
import PasswordResetScreen from "../screens/PasswordResetScreen";
import UpdatePasswordScreen from "../screens/UpdatePasswordScreen";

import ReactGA from 'react-ga';
import {useEffect} from "react";

const TRACKING_ID = "G-L08E85T9VG";

ReactGA.initialize(TRACKING_ID);

export const RouterWrapper = () => {


    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Navigate to={{pathname: "/secure/home"}}/>}/>
            <Route path={"/login"} element={<LoginScreen/>}/>
            <Route path={"/sign-up"} element={<SignUpScreen/>}/>
            <Route path={"/reset-password"} element={<PasswordResetScreen/>}/>
            <Route path={"/update-password"} element={<UpdatePasswordScreen/>}/>
            <Route path={"/secure/*"} element={<AppContainer/>}/>
            <Route path={"/not-accepted"} element={<SecureRoute>
                <NotAcceptedScreen/>
            </SecureRoute>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    </BrowserRouter>

}