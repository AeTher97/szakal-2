import React from 'react';
import {Card, CardActions, CardContent, Divider, Switch, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/SizeQuery";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {USER_ACCEPTANCE, USER_MANAGEMENT} from "../../utils/AccessRights";

const UserManagement = ({
                            user,
                            localUser,
                            setLocalUser,
                            acceptUser,
                            changeUserState,
                            acceptUserLoading,
                            changeUserStatusLoading
                        }) => {

    const {hasRight} = useAccessRightsHelper();
    const mobile = useMobileSize();
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
        </Card>
    );
};

export default UserManagement;