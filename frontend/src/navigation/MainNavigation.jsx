import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import * as React from "react";
import AppContainer from "../screens/AppContainer";


export const RouterWrapper = () => {


    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Navigate to={{pathname: "/secure"}}/>}/>
            <Route path={"/login"} element={<LoginScreen/>}/>
            <Route path={"/sign-up"} element={<SignUpScreen/>}/>
            <Route path={"/secure/*"} element={<AppContainer/>}/>
            <Route path={"/*"} element={<Typography>Not found</Typography>}/>
        </Routes>
    </BrowserRouter>

}