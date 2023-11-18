import React from 'react';
import {
    Card,
    CardContent,
    Chip,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    Typography
} from "@mui/joy";
import {uuidToColor} from "../../utils/ColorForUUID";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useRolesList} from "../../data/RolesData";

const RolesList = () => {

    const {roles, loading} = useRolesList();

    return (
        <Card variant={"outlined"} sx={{padding: 0, flex: 2}}>
            {roles && <CardContent>
                <div style={{padding: 10}}>
                    <Typography level={"title-md"}>Dostępne role</Typography>
                    <Typography level={"body-sm"}>Role zdefiniowane w systemie dla użytkowników</Typography>
                </div>
                <List variant={"plain"} sx={{paddingBottom: 0}}>
                    <ListDivider/>
                    {roles.map((role, index) => {
                        return <div key={role.id}>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemContent>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography style={{flex: 1}}>{role.name}</Typography>
                                            <div style={{flex: 5, padding: 5}}>
                                                {role.accessRights.map(accessRight =>
                                                    <Chip key={accessRight.id}
                                                          sx={{backgroundColor: uuidToColor(accessRight.id)}}>
                                                        {accessRight.description}
                                                    </Chip>)}
                                            </div>
                                        </div>
                                    </ListItemContent>
                                </ListItemButton>
                                <LinkWithRouter to={role.id}
                                                key={role.id}
                                                overlay
                                                underline={"none"}/>
                            </ListItem>
                            {index !== roles.length - 1 && <ListDivider/>}
                        </div>
                    })}
                </List>
            </CardContent>}
        </Card>
    );
};

export default RolesList;