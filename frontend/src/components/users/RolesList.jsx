import React, {useState} from 'react';
import {Card, CardContent, CardOverflow, Chip, CircularProgress, Divider, Typography} from "@mui/joy";
import {uuidToColor} from "../../utils/ColorForUUID";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useRolesList} from "../../data/RolesData";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import AddRoleDialog from "./roles/AddRoleDialog";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {ROLE_MODIFICATION} from "../../utils/AccessRights";

const RolesList = () => {

    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const {roles, loading, addRole} = useRolesList();
    const {hasRight} = useAccessRightsHelper();


    return (
        <Card variant={"outlined"} sx={{flex: 2, minWidth: 200}}>

            {roles &&
                <CardOverflow>
                    <CardContent orientation={"horizontal"} sx={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Typography level={"title-md"}>Dostępne role</Typography>
                            <Typography level={"body-sm"}>Role zdefiniowane w systemie dla użytkowników</Typography>
                        </div>
                        {hasRight(ROLE_MODIFICATION) && <div>
                            <Button onClick={() => setAddRoleOpen(true)}><AddIcon/>Dodaj</Button>
                        </div>}
                    </CardContent>
                    <CardContent>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {loading && <CircularProgress/>}
                        </div>
                        <Divider inset={"context"}/>
                        {roles.map((role, index) => {
                            return <div key={role.id}>
                                <LinkWithRouter to={`roles/${role.id}`}
                                                key={role.id}
                                                style={{width: "100%"}}
                                                underline={"none"}>
                                    <div style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                        gap: 10,
                                        flexWrap: "wrap"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flex: 2,
                                            flexDirection: "column",
                                            justifyContent: "center"
                                        }}>
                                            <Typography level={"title-md"}>{role.name}</Typography>
                                            <Typography level={"body-sm"}>{role.description}</Typography>
                                        </div>
                                        <div style={{
                                            flex: 5,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            flexWrap: "wrap",
                                            gap: 5
                                        }}>
                                            {role.accessRights.map(accessRight =>
                                                <Chip key={accessRight.id}
                                                      sx={{backgroundColor: uuidToColor(accessRight.id)}}>
                                                    {accessRight.description}
                                                </Chip>)}
                                        </div>

                                    </div>
                                </LinkWithRouter>

                                {index !== roles.length - 1 && <Divider inset={"context"}/>}

                            </div>
                        })}
                    </CardContent>
                </CardOverflow>}
            <AddRoleDialog open={addRoleOpen} addRole={addRole} close={() => setAddRoleOpen(false)}/>
        </Card>
    );
};

export default RolesList;