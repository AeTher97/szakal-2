import React from 'react';
import {useUsersList} from "../../data/UsersData";
import {
    Avatar,
    Card,
    CardContent,
    Chip,
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

const UsersList = () => {

    const {users} = useUsersList();

    return (
        <Card variant={"outlined"} sx={{padding: 0, flex: 2}}>
            {users && <CardContent>
                <List variant={"plain"} sx={{paddingBottom: 0}}>
                    <ListItem>
                        <ListItemContent>
                            <Button variant={"plain"} size={"sm"}>Imię i Nazwisko</Button>
                        </ListItemContent>
                    </ListItem>
                    <ListDivider/>
                    {users.map((user, index) => {
                        return <div key={user.id}>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemDecorator>
                                        <Avatar variant={"soft"} sx={{marginRight: 1}}>
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
                            {index !== users.length - 1 && <ListDivider/>}
                        </div>
                    })}
                </List>
            </CardContent>}
        </Card>
    );
};

export default UsersList;