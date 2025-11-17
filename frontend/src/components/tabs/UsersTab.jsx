import React from 'react';
import {Route, Routes} from "react-router";
import {Typography} from "@mui/joy";
import UsersList from "../users/UsersList";
import RolesList from "../users/RolesList";
import TabHeader from "../misc/TabHeader";
import UserDetails from "../users/UserDetails";
import RoleDetails from "../users/roles/RoleDetails";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {ROLE_VIEWING, USER_GROUP_MODIFICATION, USER_VIEWING} from "../../utils/AccessRightsList";
import GroupDetails from "../users/groups/GroupDetails";
import GroupList from "../users/GroupList";
import {useMobileSize} from "../../utils/MediaQuery";

const UsersTab = () => {

    const {hasRight} = useAccessRightsHelper();
    const mobile = useMobileSize();

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Użytkownicy</Typography>
                    </TabHeader>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 10, flexDirection: mobile ? "column" : "row"}}>
                        {hasRight(USER_VIEWING) && <UsersList/>}
                        {hasRight(ROLE_VIEWING) && <RolesList/>}
                        {hasRight(USER_GROUP_MODIFICATION) && <GroupList/>}
                    </div>
                </div>}/>
            <Route path={"/:id"} element={<UserDetails/>}/>
            <Route path={"/roles/:id"} element={<RoleDetails/>}/>
            <Route path={"/groups/:id"} element={<GroupDetails/>}/>
        </Routes>
    );
};

export default UsersTab;