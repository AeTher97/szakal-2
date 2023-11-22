import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import * as React from "react";
import AppContainer from "../screens/AppContainer";
import NotFoundScreen from "../screens/NotFoundScreen";
import NotAcceptedScreen from "../screens/NotAcceptedScreen";
import SecureRoute from "../utils/SecureRoute";


export const RouterWrapper = () => {


    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Navigate to={{pathname: "/secure/home"}}/>}/>
            <Route path={"/login"} element={<LoginScreen/>}/>
            <Route path={"/sign-up"} element={<SignUpScreen/>}/>
            <Route path={"/secure/*"} element={<AppContainer/>}/>
            <Route path={"/not-accepted"} element={<SecureRoute>
                <NotAcceptedScreen/>
            </SecureRoute>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    </BrowserRouter>

}