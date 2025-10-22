import React, {useEffect, useState} from 'react';
import {
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Typography
} from "@mui/joy";
import Button from "@mui/joy/Button";
import Pagination from "../../misc/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import UserAutocomplete from "../../misc/UserAutocomplete";
import UserAvatar from "../../misc/UserAvatar";
import PropTypes from "prop-types";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const PAGE_SIZE = 10;

const GroupUsers = ({localGroup, deleteUser, addUser, save, saveLoading}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumber, setPageNumber] = useState(0);
    const [users, setUsers] = useState([])
    const [directionAscending, setDirectionAscending] = useState(true);

    const sortUsersByFullName = (localGroupUsers, direction) => {
        return localGroupUsers.sort((a, b) => {
            const aFullName = `${a.name} ${a.surname}`;
            const bFullName = `${b.name} ${b.surname}`;
            if (aFullName < bFullName) {
                return direction ? -1 : 1;
            } else if (aFullName > bFullName) {
                return direction ? 1 : -1
            } else {
                return 0;
            }
        })
    }

    const changeSorting = () => {
        setDirectionAscending(prevDirectionAscending => !prevDirectionAscending);
    }

    useEffect(() => {
        if (!localGroup) {
            return;
        }
        const localGroupUsers = localGroup.userList;
        setUsers(sortUsersByFullName(localGroupUsers, directionAscending))
        setPageNumber(Math.ceil(localGroupUsers.length / PAGE_SIZE));
    }, [localGroup, directionAscending]);

    const usersToDisplay = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <Card variant={"outlined"} sx={{padding: 0, flex: 2, minWidth: 200}}>
            <CardContent style={{flex: 0, padding: 16, paddingBottom: 0}}>
                <Typography level={"title-md"}>Użytkownicy w grupie</Typography>
            </CardContent>
            <Divider inset={"context"}/>
            <CardContent>
                {users.length > 0 && <List variant={"plain"} sx={{paddingBottom: 0, paddingTop: 0}}>
                    <ListItem>
                        <ListItemContent>
                            <Button variant={"plain"} size={"sm"}
                                    onClick={() => changeSorting()}>
                                Imię i Nazwisko {directionAscending && <KeyboardArrowUp/>}
                                {!directionAscending && <KeyboardArrowDown/>}</Button>
                        </ListItemContent>
                    </ListItem>
                    <ListDivider/>
                    {usersToDisplay.map((user, index) => {
                        return <div key={user.id}>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemDecorator>
                                        <UserAvatar
                                            name={user.name} surname={user.surname}
                                            image={user.profilePicture} id={user.id}
                                            overrideMobile={true} bold={false}/>
                                    </ListItemDecorator>
                                    <ListItemContent>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div/>
                                            <IconButton>
                                                <DeleteIcon onClick={() => {
                                                    deleteUser(user.id);
                                                }}/>
                                            </IconButton>
                                        </div>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                            {pageNumber > 1 || index !== users.length - 1 && <ListDivider/>}

                        </div>
                    })}
                    {pageNumber > 1 && <Pagination currentPage={currentPage} concise={true} numberOfPages={pageNumber}
                                                   margin={"10px"}
                                                   setPage={(page) => setCurrentPage(page)}/>}
                </List>}
                {users && users.length === 0 &&
                    <div style={{display: "flex", justifyContent: "center", padding: 6, paddingBottom: 10}}>
                        <Typography>Brak użytkowników w grupie</Typography>
                    </div>}
                <Divider/>
            </CardContent>
            <CardContent style={{paddingLeft: 16, paddingRight: 16}}>
                <UserAutocomplete ignoreIds={users.map(user => user.id)}
                                  setUser={(user) => {
                                      if (Math.ceil((users.length + 1) / PAGE_SIZE) > pageNumber) {
                                          setCurrentPage(pageNumber + 1);
                                      } else {
                                          setCurrentPage(pageNumber);
                                      }

                                      addUser(user)
                                  }} ignoreSelf={false} clearOnSelect={true}/>
            </CardContent>
            <CardActions style={{padding: 16, paddingTop: 0}}>
                <Button onClick={save} loading={saveLoading}>Zapisz</Button>
            </CardActions>
        </Card>
    );
};

GroupUsers.propTypes = {
    localGroup: PropTypes.object.isRequired,
    deleteUser: PropTypes.func.isRequired,
    addUser: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    saveLoading: PropTypes.bool
}

export default GroupUsers;