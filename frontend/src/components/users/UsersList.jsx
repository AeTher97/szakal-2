import React, {useState} from 'react';
import {useUsersList} from "../../data/UsersData";
import {
    Card,
    CardContent,
    Chip,
    CircularProgress,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator
} from "@mui/joy";
import Button from "@mui/joy/Button";
import LinkWithRouter from "../misc/LinkWithRouter";
import {uuidToColor} from "../../utils/ColorForUUID";
import Pagination from "../misc/Pagination";
import UserAvatar from "../misc/UserAvatar";

const UsersList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const {users, loading, pageNumber} = useUsersList(currentPage - 1);

    return (
        <Card variant={"outlined"} sx={{padding: 0, paddingBottom: 1, flex: 3, minWidth: 300}}>
            <CardContent>
                <List variant={"plain"} sx={{paddingBottom: 0}}>
                    <ListItem>
                        <ListItemContent>
                            <Button variant={"plain"} size={"sm"}>Imię i Nazwisko</Button>
                        </ListItemContent>
                    </ListItem>
                    <ListDivider/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {loading && <CircularProgress/>}
                    </div>
                    {!loading && users?.map((user, index) => {
                        return <div key={user.id}>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemDecorator>
                                        <UserAvatar image={user.profilePicture} name={user.name} id={user.id}
                                                    committee={user.committee}
                                                    surname={user.surname} bold={false} overrideMobile={true}/>
                                    </ListItemDecorator>
                                    <ListItemContent>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div/>
                                            <div style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "flex-end",
                                                gap: 5
                                            }}>{user.roles.map(role => <Chip
                                                sx={{backgroundColor: uuidToColor(role.id, 0.5)}}
                                                key={role.id}>{role.name}</Chip>
                                            )}
                                            </div>
                                        </div>
                                    </ListItemContent>
                                </ListItemButton>
                                <LinkWithRouter to={user.id}
                                                key={user.id}
                                                overlay
                                                underline={"none"}/>
                            </ListItem>
                            {pageNumber > 1 || index !== users.length - 1 && <ListDivider/>}
                        </div>
                    })}
                    {pageNumber > 1 && <Pagination currentPage={currentPage} concise={true} numberOfPages={pageNumber}
                                                   margin={"10px"} firstAndLast={false}
                                                   setPage={(page) => setCurrentPage(page)}/>}

                </List>
            </CardContent>
        </Card>
    );
};

export default UsersList;