import React, {memo, useState} from 'react';
import {Route, Routes} from "react-router";
import {LinearProgress, Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CampaignsTable from "../campaigns/CampaignsTable";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/joy/Button";
import TabHeader from "../misc/TabHeader";
import AddCampaignDialog from "../campaigns/AddOrEditCampaignDialog";
import {useCampaignsList} from "../../data/CampaignData";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/MediaQuery";
import {CAMPAIGN_MODIFICATION} from "../../utils/AccessRightsList";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";

const CampaignsHome = memo(() => {

    const [currentPage, setCurrentPage] = useState(1);
    const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
    const [editedCampaign, setEditedCampaign] = useState(null);
    const [addingCampaign, setAddingCampaign] = useState(false);
    const {campaigns, loading, addCampaign, modifyCampaign, pageNumber}
        = useCampaignsList(currentPage - 1);
    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();

    const editCampaign = (campaign) =>{
        setEditedCampaign(campaign)
        setCampaignDialogOpen(true)
    }

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Akcje</Typography>
                        {hasRight(CAMPAIGN_MODIFICATION) && <Button onClick={() => {
                            setCampaignDialogOpen(true)
                            setAddingCampaign(true);
                        }}><AddIcon/>Dodaj akcję</Button>}
                    </TabHeader>
                    <LinearProgress style={{visibility: loading ? "visible" : "hidden"}}/>

                    <CampaignsTable campaigns={campaigns} editCampaign={editCampaign}/>
                    {pageNumber > 1 && <Pagination firstAndLast={!mobile}
                                                   concise={mobile}
                                                   numberOfPages={pageNumber}
                                                   currentPage={currentPage}
                                                   margin={"10px 0 10px 0"}
                                                   setPage={(page) => setCurrentPage(page)}/>}
                    <AddCampaignDialog open={campaignDialogOpen}
                                       addCampaign={addCampaign}
                                       modifyCampaign={modifyCampaign}
                                       editedCampaign={editedCampaign}
                                       addToUserGroup={addingCampaign}
                                       close={() => {
                                           setEditedCampaign(null);
                                           setCampaignDialogOpen(false);
                                           setAddingCampaign(false);
                                       }}/>
                </div>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
});

export default CampaignsHome;