import React from 'react';
import TopBar from "../components/bar/TopBar";
import MenuBar from "../components/bar/MenuBar";
import ContentColumn from "../components/main/ContentColumn";
import InnerNavigation from "../navigation/InnerNavigation";
import SecureRoute from "../utils/SecureRoute";
import {useMobileSize} from "../utils/SizeQuery";

const AppContainer = () => {

    const mobileSize = useMobileSize();

    return (
        <SecureRoute>
            <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
                <TopBar/>
                <ContentColumn>
                    {!mobileSize && <MenuBar/>}
                    <InnerNavigation/>
                </ContentColumn>
            </div>

        </SecureRoute>
    );
};

export default AppContainer;