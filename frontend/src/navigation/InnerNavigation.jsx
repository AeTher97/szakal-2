import React from 'react';
import {Route, Routes} from "react-router-dom";
import UsersHome from "../components/users/UsersHome";
import SummaryHome from "../components/summary/SummaryHome";
import CompaniesHome from "../components/companies/CompaniesHome";
import CustomBreadcrumbs from "../components/main/CustomBreadcrumbs";
import CategoriesHome from "../components/categories/CategoriesHome";
import CampaignsHome from "../components/campaigns/CampaingsHome";

const InnerNavigation = () => {

    return (<>
        <CustomBreadcrumbs/>
        <Routes>
            <Route path={"companies/*"} element={<CompaniesHome/>}/>
            <Route path={"users/*"} element={<UsersHome/>}/>
            <Route path={"categories/*"} element={<CategoriesHome/>}/>
            <Route path={"campaigns/*"} element={<CampaignsHome/>}/>
            <Route path={"/"} element={<SummaryHome/>}/>
        </Routes>
    </>);
};

export default InnerNavigation;