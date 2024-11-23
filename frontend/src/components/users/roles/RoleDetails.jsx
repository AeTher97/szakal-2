import React, {useEffect, useState} from 'react';
import {useRole} from "../../../data/RolesData";
import {useLocation} from "react-router-dom";
import {addKnownItem, removeKnownItem} from "../../../redux/MiscActions";
import {useDispatch} from "react-redux";
import RoleAuthorities from "./RoleAuthorities";
import TabHeader from "../../misc/TabHeader";
import {Typography} from "@mui/joy";
import RoleBasicInfo from "./RoleBasicInfo";

const RoleDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {role, updateRole, updateRoleLoading} = useRole(location.pathname.split("/")[4]);
    const [localRole, setLocalRole] = useState(null);
    const [setUpdateRoleDetailsLoading] = useState(false);


    useEffect(() => {
        if (role) {
            dispatch(addKnownItem(location.pathname.split("/")[4], `${role.name}`));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[4]))
            }
        }
    }, [location, role]);

    useEffect(() => {
        setLocalRole(role)
    }, [role])

    return (
        <div style={{overflow: "auto"}}>
            {role && <TabHeader>
                <div>
                    <Typography level={"h2"}>{role.name}</Typography>
                </div>
            </TabHeader>}
            {role && localRole && <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                alignItems: "stretch",
                gap: 10,
                paddingBottom: 100,
                overflow: "hidden"
            }}>
                <RoleBasicInfo
                    role={role} localRole={localRole} updateRoleInfo={(name, description) => {
                    setUpdateRoleDetailsLoading(true)
                    updateRole(name, description).then(() => {
                        setUpdateRoleDetailsLoading(false);
                    })
                }} updateRoleDetailsLoading={setUpdateRoleDetailsLoading}
                />
                <RoleAuthorities
                    role={role}
                    localRole={localRole}
                    setLocalRole={setLocalRole}
                    updateRoleLoading={updateRoleLoading}
                    updateRole={(accessRights) => {
                        updateRole(undefined, undefined, accessRights)
                    }}/>
            </div>}
        </div>
    );
};

export default RoleDetails;