import React from 'react';
import {Card, CardActions, CardContent, Divider, Switch, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/SizeQuery";

const UserManagement = ({user, localUser, setLocalUser, acceptUser}) => {

    const mobile = useMobileSize();
    return (
        <Card sx={{flexGrow: mobile ? 1 : 0}}>
            <CardContent>
                <Typography level={"title-md"}>Zarządzanie użytkownikiem</Typography>
                <Typography level={"body-sm"}>Opcje administracyjne</Typography>
            </CardContent>
            <Divider inset={"context"}/>
            <CardContent orientation={"horizontal"}>
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
            </CardContent>
            {!user.accepted && <CardActions>
                <Button onClick={() => {
                    if (localUser.accepted) {
                        acceptUser();
                    }
                }}>Zapisz</Button>
            </CardActions>
            }
        </Card>
    );
};

export default UserManagement;