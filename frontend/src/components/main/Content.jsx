import React from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import {Breadcrumbs, Link, Typography} from "@mui/joy";
import UsersBase from "../users/UsersBase";

const Content = () => {

    const location = useLocation();
    const slice = location.pathname.split("/")
        .slice(2, location.pathname.split("/").length);

    return (<>
        {slice.length > 1 && <Breadcrumbs>
            {location.pathname.split("/")
                .slice(2, location.pathname.split("/").length)
                .map(loc => <Link key={loc}>{loc}</Link>)}
        </Breadcrumbs>}
        <Routes>
            <Route path={"/companies/*"} element={<Typography>Well it works</Typography>}/>
            <Route path={"/users"} element={<UsersBase/>}/>
        </Routes>
    </>);
};

export default Content;