import React from 'react';
import {Route, Routes} from "react-router-dom";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneyDetails from "./JourneyDetails";
import JourneyList from "./JourneyList";

const JourneysHome = () => {

    return (
        <Routes>
            <Route path={"/"} element={<JourneyList/>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default JourneysHome;