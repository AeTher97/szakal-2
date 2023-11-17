import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";

const UsersBase = () => {
    return (
        <Routes>
            <Route path={"/seiema"} component={<Typography>A tu user</Typography>}/>
            <Route path={"/zmywak"} element={<Typography>Tu lista userow</Typography>}/>
        </Routes>
    );
};

export default UsersBase;