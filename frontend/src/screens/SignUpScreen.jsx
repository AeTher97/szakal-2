import React from 'react';
import {useMobileSize} from "../utils/SizeQuery";
import SignUpForm from "../components/SignUpForm";
import {useSelector} from "react-redux";

const SignUpScreen = () => {

    const isMobile = useMobileSize();
    const {theme} = useSelector(state => state.theme);
    const isLightTheme = theme === "light";

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            {!isMobile && <div style={{flex: 1, overflow: "hidden", height: "100vh"}}>
                <img src={"/iaeste.svg"}
                     style={{
                         opacity: isLightTheme ? "0.1" : "0.3",
                         height: 2500,
                         position: "relative",
                         left: -1200,
                         top: -400
                     }}/>
            </div>}
            <div style={{flex: 1}}>
                <SignUpForm/>
            </div>
        </div>
    );
};

export default SignUpScreen;