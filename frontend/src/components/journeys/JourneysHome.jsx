import React from 'react';
import {Route, Routes} from "react-router-dom";
import TabHeader from "../main/TabHeader";
import {Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import {useSelector} from "react-redux";

const JourneysHome = () => {

    const {currentCampaign} = useSelector(state => state.campaigns);
    console.log(currentCampaign)

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Kontakty w obecnej akcji</Typography>
                    </TabHeader>
                </div>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default JourneysHome;