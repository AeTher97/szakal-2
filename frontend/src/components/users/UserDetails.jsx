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
import {useMobileSize} from "../../utils/SizeQuery";

const uuidCheck = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const UserDetails = ({userId}) => {

    const location = useLocation();
    const dispatch = useDispatch();
    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();
    const idFromPath = location.pathname.split("/")[3];
    const validIdFromPath = uuidCheck.test(idFromPath);

    const {
        user, loading, updateUserRoles, updateRolesLoading, acceptUser, acceptUserLoading,
        changeUserStatus, changeUserStatusLoading, updateUserDetails, updateUserDetailsLoading,
        updateProfilePicture, deleteNotAcceptedUser
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
            document.title = `${user.name} ${user.surname}`;
            return () => {
                document.title = "Szakal 2"
            }
        }
    }, [user])

    const renderActions = () => {
        return <div style={{paddingBottom: mobile ? 5 : 0, display: "flex"}}>
            {isCurrentUser && <Button size={mobile ? "sm" : "md"} style={{flex: 1}} onClick={() => {
                setChangePasswordOpen(true)
            }}>Zmień hasło</Button>}
        </div>
    }

    return (
        <div style={{overflow: "auto"}}>
            {user && localUser && <div>
                <TabHeader>
                    <div>
                        <Typography overflow={"hidden"} noWrap level={"h2"}>{user.name} {user.surname}</Typography>
                        <Typography level={"title-sm"}>Zarejestrowany {formatLocalDateTime(user.createdAt)}</Typography>
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
                    paddingBottom: 100,
                    overflow: "hidden"
                }}>
                    <BasicUserInfo user={user} localUser={localUser} updateUserDetails={updateUserDetails}
                                   updateUserDetailsLoading={updateUserDetailsLoading}
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

export default UserDetails;