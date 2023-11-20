import React, {useState} from 'react';
import {Typography} from "@mui/joy";
import CompaniesTable from "./CompaniesTable";
import {Route, Routes} from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import NotFoundScreen from "../../screens/NotFoundScreen";
import TabHeader from "../main/TabHeader";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import {useSelector} from "react-redux";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import AddCompanyDialog from "./AddCompanyDialog";

const CompaniesHome = () => {

    const {currentCampaign} = useSelector(state => state.campaigns);
    const {companies, loading, addCompany} = useCompanyListWithCampaign(currentCampaign);
    const [addCompanyOpen, setAddCompanyOpen] = useState(false);

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Firmy</Typography>
                        <div>
                            <Button onClick={() => {
                                setAddCompanyOpen(true)
                            }}><AddIcon/>Dodaj</Button>
                        </div>
                    </TabHeader>
                    <CompaniesTable companies={companies}/>
                    <AddCompanyDialog
                        open={addCompanyOpen}
                        close={() => setAddCompanyOpen(false)}
                        addCompany={addCompany}/>
                </div>}/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CompaniesHome;