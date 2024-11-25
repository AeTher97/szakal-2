import React from 'react';
import LoginForm from "../components/auth/LoginForm";
import {useMobileSize} from "../utils/MediaQuery";
import {useLocation, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {logoutAction} from "../redux/AuthActions";

const LoginScreen = props => {

    const isMobile = useMobileSize();
    const navigate = useNavigate();
    const location = useLocation();
    const {theme} = useSelector(state => state.theme);
    const isLightTheme = theme === "light";
    const dispatch = useDispatch();


    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            {!isMobile && <div style={{flex: 1, overflow: "hidden", height: "100vh"}}>
                <img alt={"Iaeste logo"} src={"/iaeste.svg"}
                     style={{
                         opacity: isLightTheme ? "0.1" : "0.3",
                         height: 2500,
                         position: "relative",
                         left: -1200,
                         top: -400
                     }}/>
            </div>}
            <div style={{flex: 1}}>
                <LoginForm redirectBack={(active) => {
                    if (active) {
                        if (location.state?.from) {
                            if (location.state.from === "/secure" || location.state.from === "/") {
                                navigate("/secure/home")
                            } else {
                                navigate(location.state.from);
                            }
                        } else {
                            navigate("/secure/home")
                        }
                    } else {
                        dispatch(logoutAction());
                        navigate("/not-accepted", {
                            state: {
                                from: location.pathname
                            }
                        })
                    }
                }}/>
            </div>
        </div>
    );
};

export default LoginScreen;