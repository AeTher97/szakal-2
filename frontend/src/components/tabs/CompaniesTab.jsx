import React from 'react';
import {Route, Routes} from "react-router";
import CompanyDetails from "../companies/CompanyDetails";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CompanyFilters from "../companies/CompanyFilters";


const CompaniesTab = () => {

    return (
        <Routes>
            <Route path={"/"} element={<CompanyFilters/>}/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CompaniesTab;