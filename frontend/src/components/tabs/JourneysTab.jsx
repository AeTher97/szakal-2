import React from 'react';
import {Route, Routes} from "react-router-dom";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneyDetails from "../journeys/JourneyDetails";
import JourneyFilters from "../journeys/JourneyFilters";

const JourneysTab = () => {

    return (
        <Routes>
            <Route path={"/"} element={<JourneyFilters/>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default JourneysTab;