import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";
import UsersList from "./UsersList";
import RolesList from "./RolesList";
import TabHeader from "../main/TabHeader";
import UserDetails from "./UserDetails";

const UsersHome = () => {
    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Użytkownicy</Typography>
                    </TabHeader>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
                        <UsersList/>
                        <RolesList/>
                    </div>
                </div>}/>
            <Route path={"/:id"} element={<UserDetails/>}/>
        </Routes>
    );
};

export default UsersHome;