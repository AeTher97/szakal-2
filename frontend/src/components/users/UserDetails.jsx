import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useIsUser, useUserData} from "../../data/UsersData";
import {Typography} from "@mui/joy";
import TabHeader from "../main/TabHeader";
import {formatLocalDateTime} from "../../utils/DateUtils";
import BasicUserInfo from "./BasicUserInfo";
import UserRoles from "./UserRoles";
import UserManagement from "./UserManagement";
import Button from "@mui/joy/Button";
import PasswordChangeDialog from "./PasswordChangeDialog";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {USER_ACCEPTANCE, USER_MANAGEMENT, USER_ROLE_GRANTING} from "../../utils/AccessRights";

const UserDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {hasRight} = useAccessRightsHelper();
    const {
        user, loading, updateUserRoles, updateRolesLoading, acceptUser, acceptUserLoading,
        changeUserStatus, changeUserStatusLoading, updateUserDetails, updateUserDetailsLoading
    }
        = useUserData(location.pathname.split("/")[3]);
    const isCurrentUser = useIsUser(user ? user.id : "")
    const [localUser, setLocalUser] = useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(addKnownItem(location.pathname.split("/")[3], `${user.name} ${user.surname}`));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[3]))
            }
        }
    }, [location, user]);

    useEffect(() => {
        setLocalUser(user)
    }, [user])

    return (
        <div style={{overflow: "auto"}}>
            {user && localUser && <div>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{user.name} {user.surname}</Typography>
                        <Typography level={"title-sm"}>Zarejestrowany {formatLocalDateTime(user.createdAt)}</Typography>
                    </div>
                    <div>
                        {isCurrentUser && <Button onClick={() => {
                            setChangePasswordOpen(true)
                        }}>Zmień hasło</Button>}
                    </div>
                </TabHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    paddingBottom: 100,
                    overflow: "hidden"
                }}>
                    <BasicUserInfo user={user} localUser={localUser} updateUserDetails={updateUserDetails}
                                   updateUserDetailsLoading={updateUserDetailsLoading}/>
                    {hasRight(USER_ROLE_GRANTING) &&
                        <UserRoles user={user} localUser={localUser} setLocalUser={setLocalUser}
                                   updateUserRoles={updateUserRoles} updateRolesLoading={updateRolesLoading}/>}
                    {(hasRight(USER_MANAGEMENT) || hasRight(USER_ACCEPTANCE)) && <UserManagement user={user}
                                                                                                 localUser={localUser}
                                                                                                 acceptUser={acceptUser}
                                                                                                 changeUserState={changeUserStatus}
                                                                                                 changeUserStatusLoading={changeUserStatusLoading}
                                                                                                 acceptUserLoading={acceptUserLoading}
                                                                                                 setLocalUser={setLocalUser}/>}
                    <PasswordChangeDialog open={changePasswordOpen} close={() => setChangePasswordOpen(false)}
                                          userId={user}/>
                </div>
            </div>}
        </div>
    );
};

export default UserDetails;