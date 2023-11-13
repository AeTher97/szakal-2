import './App.css';
import '@fontsource/inter';
import * as React from 'react';
import Button from '@mui/joy/Button';
import {CssVarsProvider} from "@mui/joy";
import {Provider} from "react-redux";
import {authStore} from "./redux/AuthStore";
import AuthProvider from "./utils/AuthProvider";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginScreen/>,
    },
    {
        path: "sign-up",
        element: <SignUpScreen/>
    }
])

function App() {

    return (
        <CssVarsProvider defaultMode={"dark"}>
            <Provider store={authStore}>
                <AuthProvider/>
                <main className={"App-header"}>
                    <RouterProvider router={router}/>
                </main>
            </Provider>
        </CssVarsProvider>
    );
}

function ButtonUsage() {
    return <Button variant="solid">Hello world</Button>;
}

export default App;
