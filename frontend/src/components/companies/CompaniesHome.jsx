import React from 'react';
import {Typography} from "@mui/joy";
import CompaniesTable from "./CompaniesTable";
import {Route, Routes} from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import NotFoundScreen from "../../screens/NotFoundScreen";
import AddCompany from "./AddCompany";
import TabHeader from "../main/TabHeader";

const CompaniesHome = () => {
    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Firmy</Typography>
                    </TabHeader>
                    <CompaniesTable/>
                </div>}/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/add"} element={<AddCompany/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CompaniesHome;