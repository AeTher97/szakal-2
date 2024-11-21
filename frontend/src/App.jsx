import './App.css';
import '@fontsource/inter';
import * as React from 'react';
import {useEffect} from 'react';
import {CssVarsProvider, Snackbar, useColorScheme} from "@mui/joy";
import {Provider, useDispatch, useSelector} from "react-redux";
import {stores} from "./redux/Stores";
import AuthProvider from "./components/auth/AuthProvider";
import {MainNavigationRoutes} from "./components/navigation/MainNavigationRoutes";
import {closeAlert} from "./redux/AlertActions";

const AppWithAuth = () => {

    const {theme} = useSelector(state => state.theme);
    const {setMode} = useColorScheme();

    useEffect(() => {
        setMode(theme)
        document.getElementById("body")
            .style.backgroundColor = theme === "light" ? "rgb(255,255,255)" : "rgb(11, 13, 14)";
    }, [theme]);

    useEffect(() => {
        if (isDevEnv()) {
            document.title = "Szakal 2 (Development)";
        }
    }, []);

    return <>
        <AuthProvider/>
        <main style={{
            backgroundColor: theme === "light" ? "rgb(255,255,255)" : "rgb(11, 13, 14)",
            minHeight: "100vh",
            fontSize: "calc(10px + 2vmin)",
            color: "white"
        }}>
            <MainNavigationRoutes/>
        </main>
    </>
}

const AppWithCss = () => {
    const dispatch = useDispatch();
    const {severity, message, isOpen} = useSelector(state => state.alert);

    return (
        <CssVarsProvider>
            <AppWithAuth/>
            {severity && <Snackbar open={isOpen} autoHideDuration={3000} color={severity} onClose={() => {
                dispatch(closeAlert())
            }}>
                {message}
            </Snackbar>}
        </CssVarsProvider>
    );
};

function App() {

    return (
        <Provider store={stores}>
            <AppWithCss/>
        </Provider>
    );
}

export const setDefaultTitle = () => {
    if (isDevEnv()) {
        document.title = "Szakal 2 (Development)";
    } else {
        document.title = "Szakal 2";
    }
}

export const isDevEnv = () => {
    return import.meta.env.DEV;
}

export default App;
