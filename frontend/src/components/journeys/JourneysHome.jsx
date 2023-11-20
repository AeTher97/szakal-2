import React from 'react';
import {Route, Routes} from "react-router-dom";
import TabHeader from "../main/TabHeader";
import {Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneysTable from "./JourneysTable";
import {useCurrentCampaignJourneyList} from "../../data/JourneyData";
import JourneyDetails from "./JourneyDetails";

const JourneysHome = () => {

    const {journeys} = useCurrentCampaignJourneyList();

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Kontakty w obecnej akcji</Typography>
                    </TabHeader>
                    <JourneysTable journeys={journeys}/>
                </div>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default JourneysHome;