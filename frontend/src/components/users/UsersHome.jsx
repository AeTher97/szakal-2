import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";
import UsersList from "./UsersList";
import RolesList from "./RolesList";
import TabHeader from "../main/TabHeader";
import UserDetails from "./UserDetails";
import RoleDetails from "./roles/RoleDetails";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {ROLE_VIEWING, USER_GROUP_MODIFICATION, USER_VIEWING} from "../../utils/AccessRights";
import GroupDetails from "./groups/GroupDetails";
import GroupList from "./GroupList";

const UsersHome = () => {

    const {hasRight} = useAccessRightsHelper();

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "auto", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Użytkownicy</Typography>
                    </TabHeader>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
                        {hasRight(USER_VIEWING) && <UsersList/>}
                        {hasRight(USER_GROUP_MODIFICATION) && <GroupList/>}
                        {hasRight(ROLE_VIEWING) && <RolesList/>}
                    </div>
                </div>}/>
            <Route path={"/:id"} element={<UserDetails/>}/>
            <Route path={"/roles/:id"} element={<RoleDetails/>}/>
            <Route path={"/groups/:id"} element={<GroupDetails/>}/>
        </Routes>
    );
};

export default UsersHome;