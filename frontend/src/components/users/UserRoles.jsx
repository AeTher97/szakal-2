import React from 'react';
import {Card, CardActions, CardContent, Chip, ChipDelete, Divider, Typography} from "@mui/joy";
import {uuidToColor} from "../../utils/ColorForUUID";
import Button from "@mui/joy/Button";
import {useRolesList} from "../../data/RolesData";
import {useMobileSize} from "../../utils/SizeQuery";

const UserRoles = ({localUser, setLocalUser, updateUserRoles, updateRolesLoading}) => {

    const {roles, loading: rolesLoading} = useRolesList();
    const mobile = useMobileSize();

    return (
        <Card sx={{maxWidth: 640, flex: 1, minWidth: mobile ? 200 : 400}}>
            <CardContent>
                <Typography level={"title-md"}>Role</Typography>
                <Typography level={"body-sm"}>Role które posiada użytkownik</Typography>
            </CardContent>
            <Divider/>
            <CardContent orientation={mobile ? "vertical" : "horizontal"} style={{flex: 0}}>
                {localUser.roles.map(role => <Chip key={role.id}
                                                   sx={{backgroundColor: uuidToColor(role.id, 0.5)}}
                                                   endDecorator={<ChipDelete onDelete={() => {
                                                       setLocalUser(old => {
                                                           return {
                                                               ...old,
                                                               roles: old.roles.filter(innerRole => innerRole.id !== role.id)
                                                           }
                                                       })
                                                   }}/>}>
                    {role.name}
                </Chip>)}
                {localUser.roles.length === 0 && <Typography>Brak ról</Typography>}
            </CardContent>
            <Divider/>
            <CardContent>
                <Typography level={"title-md"}>Dostępne role</Typography>
                <Typography level={"body-sm"}>Wybierz role dla użytkownika</Typography>
                <div>
                    {roles.filter(role => {
                        return !localUser.roles.find(userRole => userRole.id === role.id);
                    }).map(role => <Chip sx={{backgroundColor: uuidToColor(role.id, 0.5)}}
                                         key={role.id}
                                         onClick={() => {
                                             setLocalUser(old => {
                                                 return {
                                                     ...old,
                                                     roles: [...old.roles, role]
                                                 }
                                             })
                                         }}
                                         variant={"soft"}>
                        {role.name}
                    </Chip>)}
                </div>
            </CardContent>
            <CardActions>
                <Button loading={updateRolesLoading}
                    onClick={() => updateUserRoles(localUser.roles.map(localRole => localRole.id))}>Zapisz</Button>
            </CardActions>
        </Card>
    );
};

export default UserRoles;