import './App.css';
import '@fontsource/inter';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {CssVarsProvider, Snackbar, useColorScheme} from "@mui/joy";
import {Provider, useDispatch, useSelector} from "react-redux";
import {stores} from "./redux/Stores";
import AuthProvider from "./utils/AuthProvider";
import {RouterWrapper} from "./navigation/MainNavigation";
import {closeAlert} from "./redux/AlertActions";
import {loadFavouriteJourneysAction} from "./redux/ReducerActions";
import {decodeToken, isTokenOutdated} from "./utils/TokenUtils";

const AppWithoutCss = () => {

    const [loadedFavouriteJourneys, setLoadedFavouriteJourneys] = useState(false);
    const {theme} = useSelector(state => state.theme);
    const {isAuthenticated, accessToken} = useSelector(state => state.auth)
    const {setMode} = useColorScheme();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && !isTokenOutdated(decodeToken(accessToken).expirationTime) && !loadedFavouriteJourneys) {
            dispatch(loadFavouriteJourneysAction(accessToken))
                .then(() => setLoadedFavouriteJourneys(true));
        }
    }, [isAuthenticated, accessToken])

    useEffect(() => {
        setMode(theme)
        document.getElementById("body")
            .style.backgroundColor = theme === "light" ? "rgb(255,255,255)" : "rgb(11, 13, 14)";
    }, [theme]);

    useEffect(() => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
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
            <RouterWrapper/>
        </main>
    </>
}

const AppWithoutRedux = () => {
    const dispatch = useDispatch();
    const {severity, message, isOpen} = useSelector(state => state.alert);

    return (
        <CssVarsProvider>
            <AppWithoutCss/>
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
            <AppWithoutRedux/>
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
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export default App;
