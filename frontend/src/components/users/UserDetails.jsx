import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useUserData} from "../../data/UsersData";
import {Typography} from "@mui/joy";
import TabHeader from "../main/TabHeader";
import {formatLocalDateTime} from "../../utils/DateUtils";
import BasicUserInfo from "./BasicUserInfo";
import UserRoles from "./UserRoles";
import UserManagement from "./UserManagement";

const UserDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {user, loading, updateUserRoles, acceptUser} = useUserData(location.pathname.split("/")[3]);
    const [localUser, setLocalUser] = useState(null);

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
        <div style={{overflow: "scroll"}}>
            {user && localUser && <div>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{user.name} {user.surname}</Typography>
                        <Typography>Zarejestrowany {formatLocalDateTime(user.createdAt)}</Typography>
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
                    <BasicUserInfo user={user} localUser={localUser}/>
                    <UserRoles user={user} localUser={localUser} setLocalUser={setLocalUser}
                               updateUserRoles={updateUserRoles}/>
                    <UserManagement user={user} localUser={localUser} acceptUser={acceptUser}
                                    setLocalUser={setLocalUser}/>
                </div>
            </div>}
        </div>
    );
};

export default UserDetails;