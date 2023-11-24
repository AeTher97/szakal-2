import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {LinearProgress, Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CampaignsTable from "./CampaignsTable";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/joy/Button";
import TabHeader from "../main/TabHeader";
import AddCampaignDialog from "./AddCampaignDialog";
import {useCampaignsList} from "../../data/CampaignData";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";
import {CAMPAIGN_MODIFICATION} from "../../utils/AccessRights";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";

const CampaignsHome = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [addCampaignOpen, setAddCampaignOpen] = useState(false);
    const {campaigns, loading, addCampaign, pageNumber} = useCampaignsList(currentPage - 1);
    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();


    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Akcje</Typography>
                        {hasRight(CAMPAIGN_MODIFICATION) && <Button onClick={() => {
                            setAddCampaignOpen(true)
                        }}><AddIcon/>Dodaj akcję</Button>}
                    </TabHeader>
                    {loading && <LinearProgress/>}

                    <CampaignsTable campaigns={campaigns}/>
                    {pageNumber > 1 && <Pagination firstAndLast={!mobile} concise={mobile} numberOfPages={pageNumber}
                                                   currentPage={currentPage}
                                                   setPage={(page) => setCurrentPage(page)}/>}
                    <AddCampaignDialog open={addCampaignOpen} addCampaign={addCampaign}
                                       close={() => setAddCampaignOpen(false)}/>
                </div>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CampaignsHome;