import {BrowserRouter, Route, Routes} from "react-router-dom";
import SecureRoute from "../utils/SecureRoute";
import {Typography} from "@mui/joy";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import * as React from "react";
import HomeScreen from "../screens/HomeScreen";


export const RouterWrapper = () => {


    return <BrowserRouter>
        <Routes>
            <Route path={"/login"} element={<LoginScreen/>}/>
            <Route path={"/sign-up"} element={<SignUpScreen/>}/>
            <Route path={"/secure/*"} element={<SecureRoute><HomeScreen/></SecureRoute>}/>
            <Route path={"/*"} element={<Typography>Not found</Typography>}/>
        </Routes>
    </BrowserRouter>

}