import React from 'react';
import {Route, Routes} from "react-router-dom";
import UsersHome from "../components/users/UsersHome";
import SummaryHome from "../components/summary/SummaryHome";
import CompaniesHome from "../components/companies/CompaniesHome";
import CustomBreadcrumbs from "../components/main/CustomBreadcrumbs";
import CategoriesHome from "../components/categories/CategoriesHome";
import CampaignsHome from "../components/campaigns/CampaingsHome";
import NotFoundScreen from "../screens/NotFoundScreen";
import JourneysHome from "../components/journeys/JourneysHome";
import UserJourneysHome from "../components/journeys/UserJourneysHome";

const InnerNavigation = () => {

    return (<>
        <CustomBreadcrumbs/>
        <Routes>
            <Route path={"companies/*"} element={<CompaniesHome/>}/>
            <Route path={"journeys/*"} element={<JourneysHome/>}/>
            <Route path={"users/*"} element={<UsersHome/>}/>
            <Route path={"categories/*"} element={<CategoriesHome/>}/>
            <Route path={"campaigns/*"} element={<CampaignsHome/>}/>
            <Route path={"user-journeys/*"} element={<UserJourneysHome/>}/>
            <Route path={"home"} element={<SummaryHome/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    </>);
};

export default InnerNavigation;