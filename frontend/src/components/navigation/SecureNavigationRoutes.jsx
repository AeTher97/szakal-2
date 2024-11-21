import React from 'react';
import {Route, Routes} from "react-router-dom";
import UsersTab from "../tabs/UsersTab";
import SummaryTab from "../tabs/SummaryTab";
import CompaniesTab from "../tabs/CompaniesTab";
import CustomBreadcrumbs from "../misc/CustomBreadcrumbs";
import CategoriesTab from "../tabs/CategoriesTab";
import CampaignsHome from "../tabs/CampaignsTab";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneysTab from "../tabs/JourneysTab";
import UserJourneysTab from "../tabs/UserJourneysTab";
import ProfileTab from "../tabs/ProfileTab";
import AppSettingsTab from "../tabs/AppSettingsTab";

const SecureNavigationRoutes = () => {

    return (<>
        <CustomBreadcrumbs/>
        <Routes>
            <Route path={"companies/*"} element={<CompaniesTab/>}/>
            <Route path={"journeys/*"} element={<JourneysTab/>}/>
            <Route path={"users/*"} element={<UsersTab/>}/>
            <Route path={"categories/*"} element={<CategoriesTab/>}/>
            <Route path={"campaigns/*"} element={<CampaignsHome/>}/>
            <Route path={"user-journeys/*"} element={<UserJourneysTab/>}/>
            <Route path={"home"} element={<SummaryTab/>}/>
            <Route path={"profile"} element={<ProfileTab/>}/>
            <Route path={"app-settings"} element={<AppSettingsTab/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    </>);
};

export default SecureNavigationRoutes;