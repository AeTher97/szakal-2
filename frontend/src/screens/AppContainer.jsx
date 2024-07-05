import React from 'react';
import TopBar from "../components/bar/TopBar";
import MenuBar from "../components/bar/MenuBar";
import ContentColumn from "../components/main/ContentColumn";
import InnerNavigation from "../navigation/InnerNavigation";
import SecureRoute from "../utils/SecureRoute";
import {useFullColumnSize, useMobileSize} from "../utils/SizeQuery";
import Footer from "../components/Footer";

const AppContainer = () => {

    const mediumSize = useFullColumnSize();

    return (
        <SecureRoute>
            <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
                <TopBar/>
                <ContentColumn>
                    {!mediumSize && <MenuBar/>}
                    <InnerNavigation/>
                </ContentColumn>
            </div>

        </SecureRoute>
    );
};

export default AppContainer;