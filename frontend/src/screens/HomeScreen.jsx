import React from 'react';
import TopBar from "../components/bar/TopBar";
import MenuBar from "../components/bar/MenuBar";
import ContentColumn from "../components/main/ContentColumn";
import Content from "../components/main/Content";

const HomeScreen = () => {
    return (
        <>
            <TopBar/>
            <ContentColumn>
                <MenuBar/>
                <Content/>
            </ContentColumn>
        </>
    );
};

export default HomeScreen;