import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router";
import {useDispatch} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/MiscActions";
import {useIsUser, useUserData} from "../../data/UsersData";
import {Button, LinearProgress, Typography} from "@mui/joy";
import TabHeader from "../misc/TabHeader";
import {formatLocalDateTime} from "../../utils/DateUtils";
import BasicUserInfo from "./BasicUserInfo";
import UserRoles from "./UserRoles";
import UserManagement from "./UserManagement";
import PasswordChangeDialog from "./PasswordChangeDialog";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {USER_ACCEPTANCE, USER_MANAGEMENT, USER_ROLE_GRANTING} from "../../utils/AccessRightsList";
import {useMobileSize} from "../../utils/MediaQuery";
import {isDevEnv, setDefaultTitle} from "../../App";
import PropTypes from "prop-types";

const uuidCheck = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const UserDetails = ({userId}) => {

    const location = useLocation();
    const dispatch = useDispatch();
    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();
    const idFromPath = location.pathname.split("/")[3];
    const validIdFromPath = uuidCheck.test(idFromPath);

    const {
        loading,
        user,
        updateUserRoles,
        updateRolesLoading,
        acceptUser,
        acceptUserLoading,
        changeUserStatus,
        changeUserStatusLoading,
        updateUserDetails,
        updateUserDetailsLoading,
        updateProfilePicture,
        deleteNotAcceptedUser,
        updatePictureLoading
    } = useUserData(validIdFromPath ? idFromPath : userId);

    const isCurrentUser = useIsUser(user ? user.id : "")
    const [localUser, setLocalUser] = useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(addKnownItem(validIdFromPath ? idFromPath : userId, `${user.name} ${user.surname}`));
            return () => {
                dispatch(removeKnownItem(validIdFromPath ? idFromPath : userId))
            }
        }
    }, [location, user]);

    useEffect(() => {
        setLocalUser(user)
        if (user) {
            document.title = `${user.name} ${user.surname} ${isDevEnv() ? "(Development)" : ""}`;
            return () => {
                setDefaultTitle();
            }
        }
    }, [user])

    const renderActions = () => {
        return <div style={{display: "flex"}}>
            {isCurrentUser && <Button size={mobile ? "sm" : "md"} style={{flex: 1}} onClick={() => {
                setChangePasswordOpen(true)
            }}>Zmień hasło</Button>}
        </div>
    }

    return (
        <div style={{overflow: "auto"}}>
            {loading && <LinearProgress/>}
            {!loading && user && localUser && <div>
                <TabHeader>
                    <div>
                        <Typography overflow={"hidden"} noWrap level={"h2"}>{user.name} {user.surname}</Typography>
                        <Typography
                            level={"title-sm"}>Zarejestrowany {formatLocalDateTime(user.createdAt)}</Typography>
                    </div>
                    {!mobile && renderActions()}
                </TabHeader>
                {mobile && renderActions()}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    overflow: "hidden"
                }}>
                    <BasicUserInfo user={user} localUser={localUser} updateUserDetails={updateUserDetails}
                                   updateUserDetailsLoading={updateUserDetailsLoading}
                                   updatePictureLoading={updatePictureLoading}
                                   updateProfilePicture={updateProfilePicture}/>
                    {hasRight(USER_ROLE_GRANTING) &&
                        <UserRoles user={user} localUser={localUser} setLocalUser={setLocalUser}
                                   updateUserRoles={updateUserRoles} updateRolesLoading={updateRolesLoading}/>}
                    {(hasRight(USER_MANAGEMENT) || hasRight(USER_ACCEPTANCE)) && <UserManagement user={user}
                                                                                                 localUser={localUser}
                                                                                                 acceptUser={acceptUser}
                                                                                                 changeUserState={changeUserStatus}
                                                                                                 changeUserStatusLoading={changeUserStatusLoading}
                                                                                                 acceptUserLoading={acceptUserLoading}
                                                                                                 setLocalUser={setLocalUser}
                                                                                                 deleteNotAcceptedUser={deleteNotAcceptedUser}/>}
                    <PasswordChangeDialog open={changePasswordOpen} close={() => setChangePasswordOpen(false)}
                                          userId={user.id}/>
                </div>
            </div>}
        </div>
    );
};

UserDetails.propTypes = {
    userId: PropTypes.string
}

export default UserDetails;