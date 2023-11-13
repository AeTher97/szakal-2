import React from 'react';
import LoginForm from "../components/LoginForm";
import {useMobileSize} from "../utils/SizeQuery";

const LoginScreen = () => {

    const isMobile = useMobileSize();

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            {!isMobile && <div style={{flex: 1, overflow: "hidden", height: "100vh"}}>
                <img src={"/iaeste.svg"}
                     style={{opacity: "0.1", height: 2500, position: "relative", left: -1200, top: -400}}/>
            </div>}
            <div style={{flex: 1}}>
                <LoginForm/>
            </div>
        </div>
    );
};

export default LoginScreen;