import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CampaignsTable from "./CampaignsTable";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/joy/Button";
import TabHeader from "../main/TabHeader";
import AddCampaignDialog from "./AddCampaignDialog";
import {useCampaignsList} from "../../data/CampaignData";

const CampaignsHome = () => {

    const [addCampaignOpen, setAddCampaignOpen] = useState(false);
    const {campaigns, loading, addCampaign} = useCampaignsList();


    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Akcje</Typography>
                        <Button onClick={() => {
                            setAddCampaignOpen(true)
                        }}><AddIcon/>Dodaj akcję</Button>
                    </TabHeader>
                    <CampaignsTable campaigns={campaigns}/>
                    <AddCampaignDialog open={addCampaignOpen} addCampaign={addCampaign}
                                       close={() => setAddCampaignOpen(false)}/>
                </div>}/>
            {/*<Route path={"/:id"} element={<CompanyDetails/>}/>*/}
            {/*<Route path={"/add"} element={<AddCompany/>}/>*/}
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CampaignsHome;