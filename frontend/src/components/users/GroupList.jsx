import React, {useState} from 'react';
import {Card, CardContent, CardOverflow, CircularProgress, Divider, IconButton, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import LinkWithRouter from "../misc/LinkWithRouter";
import {useGroupsList} from "../../data/GroupsData";
import AddGroupDialog from "./groups/AddGroupDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import {useConfirmationDialog} from "../misc/ConfirmationDialog";

const GroupList = () => {

    const {groups, addGroup, deleteGroup, loading} = useGroupsList();

    const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz usunąć grupę?")
    const [addGroupOpen, setAddGroupOpen] = useState(false);

    return (
        <Card variant={"outlined"} sx={{flex: 2, minWidth: 250}}>
            {groups &&
                <CardOverflow>
                    <CardContent orientation={"horizontal"} sx={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Typography level={"title-md"}>Grupy użytkowników</Typography>
                            <Typography level={"body-sm"}>Groupy z dostępem do listy akcji</Typography>
                        </div>
                        <div>
                            <Button
                                onClick={() => setAddGroupOpen(true)}>
                                <AddIcon/>Dodaj
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {loading && <CircularProgress/>}
                        </div>
                        <Divider inset={"context"}/>
                        {groups.map((group, index) => {
                            return <div key={group.id}>
                                <div style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                    gap: 10,
                                }}>
                                    <LinkWithRouter to={`groups/${group.id}`}
                                                    key={group.id}
                                                    style={{width: "100%"}}
                                                    underline={"none"}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center"
                                        }}>
                                            <Typography level={"title-md"}>{group.name}</Typography>
                                            <Typography
                                                level={"body-sm"}>Użytkownicy: {group.userList.length}</Typography>
                                            <Typography
                                                level={"body-sm"}>Akcje: {group.campaignList.length}</Typography>
                                        </div>
                                    </LinkWithRouter>

                                    <div>
                                        <IconButton>
                                            <DeleteIcon onClick={() => {
                                                openDialog(() => {
                                                    deleteGroup(group.id)
                                                })
                                            }}/>
                                        </IconButton>
                                    </div>

                                </div>
                                {index !== groups.length - 1 && <Divider inset={"context"}/>}
                            </div>
                        })}
                    </CardContent>
                </CardOverflow>}
            <AddGroupDialog open={addGroupOpen} addRole={addGroup} close={() => setAddGroupOpen(false)}/>
            {render()}
        </Card>
    );
};
export default GroupList;