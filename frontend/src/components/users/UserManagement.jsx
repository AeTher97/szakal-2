import React from 'react';
import {Card, CardActions, CardContent, Divider, Switch, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/MediaQuery";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {USER_ACCEPTANCE, USER_MANAGEMENT} from "../../utils/AccessRightsList";
import {useConfirmationDialog} from "../misc/ConfirmationDialog";
import {useNavigate} from "react-router-dom";

const UserManagement = ({
                            user,
                            localUser,
                            setLocalUser,
                            acceptUser,
                            deleteNotAcceptedUser,
                            changeUserState,
                            acceptUserLoading,
                            changeUserStatusLoading
                        }) => {

    const {hasRight} = useAccessRightsHelper();
    const mobile = useMobileSize();
    const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz usunąć tego użytkownika?")
    const navigate = useNavigate();


    return (
        <Card sx={{flexGrow: mobile ? 1 : 0, minWidth: 200}}>
            <CardContent>
                <Typography level={"title-md"}>Zarządzanie użytkownikiem</Typography>
                <Typography level={"body-sm"}>Opcje administracyjne</Typography>
            </CardContent>
            <Divider inset={"context"}/>
            {hasRight(USER_ACCEPTANCE) && <CardContent orientation={"horizontal"}>
                <Typography>Użytkownik zaakceptowany</Typography>
                <Switch checked={localUser.accepted}
                        disabled={user.accepted}
                        onClick={() => {
                            setLocalUser(old => {
                                return {
                                    ...old,
                                    accepted: true
                                }
                            })
                        }}/>
            </CardContent>}
            {hasRight(USER_ACCEPTANCE) && !user.accepted && <CardContent orientation={"horizontal"}>
                <Button color={"neutral"} onClick={() => {
                    openDialog(() => {
                        deleteNotAcceptedUser().then(() =>{
                            navigate("/secure/users");
                        })
                    })
                }}>Usuń niezaakceptowanego użytkownika</Button>
            </CardContent>}
            {hasRight(USER_MANAGEMENT) && <CardContent orientation={"horizontal"}>
                <Typography>Użytkownik aktywny</Typography>
                <Switch checked={localUser.active}
                        onClick={() => {
                            setLocalUser(old => {
                                return {
                                    ...old,
                                    active: !localUser.active
                                }
                            })
                        }}/>
            </CardContent>}
            <CardActions>
                <Button onClick={() => {
                    if (localUser.accepted && !user.accepted) {
                        acceptUser().then(e => {
                            if (localUser.active && !user.active) {
                                changeUserState(localUser.active);
                            }
                        });
                        return;
                    }
                    if (localUser.active !== user.active) {
                        changeUserState(localUser.active);
                    }
                }} loading={acceptUserLoading || changeUserStatusLoading}>Zapisz</Button>
            </CardActions>
            {render()}
        </Card>
    );
};

export default UserManagement;