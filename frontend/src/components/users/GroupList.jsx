import React from 'react';
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {Card, CardContent, CardOverflow, CircularProgress, Divider, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useGroupsList} from "../../data/GroupData";

const GroupList = () => {

    const {groups, loading} = useGroupsList();
    const {hasRight} = useAccessRightsHelper();

    console.log(groups)
    return (
        <Card variant={"outlined"} sx={{flex: 2, minWidth: 200}}>
            {groups &&
                <CardOverflow>
                    <CardContent orientation={"horizontal"} sx={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Typography level={"title-md"}>Grupy użytkowników</Typography>
                            <Typography level={"body-sm"}>Groupy z dostępem do listy akcji</Typography>
                        </div>
                        <div>
                            <Button
                                // onClick={() => setAddRoleOpen(true)}
                            ><AddIcon/>Dodaj</Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {loading && <CircularProgress/>}
                        </div>
                        <Divider inset={"context"}/>
                        {groups.map((group, index) => {
                            return <div key={group.id}>
                                <LinkWithRouter to={`groups/${group.id}`}
                                                key={group.id}
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
                                            flexDirection: "column",
                                            justifyContent: "center"
                                        }}>
                                            <Typography level={"title-md"}>{group.name}</Typography>
                                            <Typography level={"body-sm"}>Użytkownicy: {group.userList.length}</Typography>
                                            <Typography level={"body-sm"}>Akcje: {group.campaignList.length}</Typography>
                                        </div>
                                        <div style={{
                                            flex: 5,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            flexWrap: "wrap",
                                            gap: 5
                                        }}>
                                            {/*{role.accessRights.map(accessRight =>*/}
                                            {/*    <Chip key={accessRight.id}*/}
                                            {/*          sx={{backgroundColor: uuidToColor(accessRight.id)}}>*/}
                                            {/*        {accessRight.description}*/}
                                            {/*    </Chip>)}*/}
                                        </div>

                                    </div>
                                </LinkWithRouter>

                                {index !== groups.length - 1 && <Divider inset={"context"}/>}

                            </div>
                        })}
                    </CardContent>
                </CardOverflow>}
            {/*<AddRoleDialog open={addRoleOpen} addRole={addRole} close={() => setAddRoleOpen(false)}/>*/}
        </Card>
    );
};
export default GroupList;