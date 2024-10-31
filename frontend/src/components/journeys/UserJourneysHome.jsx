import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import TabHeader from "../main/TabHeader";
import {LinearProgress, Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneyTable from "./JourneyTable";
import {useUserJourneyList} from "../../data/JourneyData";
import JourneyDetails from "./JourneyDetails";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";

const UserJourneysHome = () => {

    const mobile = useMobileSize();
    const [currentPage, setCurrentPage] = useState(1);
    const {journeys, loading, pagesNumber} = useUserJourneyList(currentPage - 1);

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Twoje kontakty</Typography>
                    </TabHeader>
                    <LinearProgress style={{visibility: loading ? "visible" : "hidden"}}/>

                    <JourneyTable journeys={journeys}/>
                    {pagesNumber > 1 &&
                        <Pagination currentPage={currentPage} numberOfPages={pagesNumber} firstAndLast={!mobile}
                                    concise={mobile} setPage={(page) => setCurrentPage(page)}
                                    margin={"10px 0 10px 0"}
                        />}
                </div>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default UserJourneysHome;