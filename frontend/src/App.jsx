import './App.css';
import '@fontsource/inter';
import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/joy/Button';
import {CssVarsProvider, Snackbar, useColorScheme} from "@mui/joy";
import {Provider, useDispatch, useSelector} from "react-redux";
import {stores} from "./redux/Stores";
import AuthProvider from "./utils/AuthProvider";
import {RouterWrapper} from "./navigation/MainNavigation";
import {closeAlert} from "./redux/AlertActions";

const AppWithoutCss = () => {

    const {theme} = useSelector(state => state.theme);
    const {mode, setMode} = useColorScheme();

    useEffect(() => {
        setMode(theme)
    }, [theme]);

    return <><AuthProvider/>
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

function ButtonUsage() {
    return <Button variant="solid">Hello world</Button>;
}

export default App;
