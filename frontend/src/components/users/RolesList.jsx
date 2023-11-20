import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CardOverflow,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    Typography
} from "@mui/joy";
import {uuidToColor} from "../../utils/ColorForUUID";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useRolesList} from "../../data/RolesData";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import AddRoleDialog from "./AddRoleDialog";

const RolesList = () => {

    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const {roles, loading, addRole} = useRolesList();

    return (
        <Card variant={"outlined"} sx={{flex: 2, minWidth: 200}}>

            {roles &&
                <CardOverflow>
                    <CardContent orientation={"horizontal"} sx={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Typography level={"title-md"}>Dostępne role</Typography>
                            <Typography level={"body-sm"}>Role zdefiniowane w systemie dla użytkowników</Typography>
                        </div>
                        <div>
                            <Button onClick={() => setAddRoleOpen(true)}><AddIcon/>Dodaj</Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <List variant={"plain"} sx={{padding: 0}}>
                            <Divider inset={"context"}/>
                            {roles.map((role, index) => {
                                return <div key={role.id}>
                                    <ListItem sx={{paddingLeft: 0}}>
                                        <ListItemButton>
                                            <ListItemContent>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Typography style={{flex: 2}}>{role.name}</Typography>
                                                    <div style={{flex: 5}}>
                                                        {role.accessRights.map(accessRight =>
                                                            <Chip key={accessRight.id}
                                                                  sx={{backgroundColor: uuidToColor(accessRight.id)}}>
                                                                {accessRight.description}
                                                            </Chip>)}
                                                    </div>
                                                </div>
                                            </ListItemContent>
                                        </ListItemButton>
                                        <LinkWithRouter to={`roles/${role.id}`}
                                                        key={role.id}
                                                        overlay
                                                        underline={"none"}/>
                                    </ListItem>
                                    {index !== roles.length - 1 && <Divider inset={"context"}/>}
                                </div>
                            })}
                        </List>
                    </CardContent>
                </CardOverflow>}
            <AddRoleDialog open={addRoleOpen} addRole={addRole} close={() => setAddRoleOpen(false)}/>
        </Card>
    );
};

export default RolesList;