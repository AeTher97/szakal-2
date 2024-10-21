import React from 'react';
import {Route, Routes} from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CompanyList from "./CompanyList";


const CompaniesHome = () => {

    return (
        <Routes>
            <Route path={"/"} element={<CompanyList/>}/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CompaniesHome;