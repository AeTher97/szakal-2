import React, {useState} from 'react';
import {useUsersList} from "../../data/UsersData";
import {
    Avatar,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Typography
} from "@mui/joy";
import Button from "@mui/joy/Button";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {uuidToColor} from "../../utils/ColorForUUID";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";

const UsersList = () => {

    const mobile = useMobileSize();
    const [currentPage, setCurrentPage] = useState(1);
    const {users, loading, pageNumber} = useUsersList(currentPage - 1);

    return (
        <Card variant={"outlined"} sx={{padding: 0, flex: 2, minWidth: 200}}>
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
                    {users && users.map((user, index) => {
                        return <div key={user.id}>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemDecorator>
                                        <Avatar variant={"soft"} sx={{marginRight: 1}} src={`data:image;base64,${user.profilePicture}`}>
                                            {user.name[0]}
                                            {user.surname[0]}
                                        </Avatar>
                                    </ListItemDecorator>
                                    <ListItemContent>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography>{user.name} {user.surname}</Typography>
                                            <div>{user.roles.map(role => <Chip
                                                sx={{backgroundColor: uuidToColor(role.id)}}
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
                    {pageNumber > 1 && <Pagination currentPage={currentPage} concise={mobile} numberOfPages={pageNumber}
                                                   setPage={(page) => setCurrentPage(page)} />}

                </List>
            </CardContent>
        </Card>
    );
};

export default UsersList;