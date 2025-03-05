import React, {useState} from 'react';
import {useUsersList} from "../../data/UsersData";
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormLabel,
    Input,
    List,
    ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Option,
    Select
} from "@mui/joy";
import Button from "@mui/joy/Button";
import LinkWithRouter from "../misc/LinkWithRouter";
import {uuidToColor} from "../../utils/ColorForUUID";
import Pagination from "../misc/Pagination";
import UserAvatar from "../misc/UserAvatar";
import {useRolesList} from "../../data/RolesData";
import SearchIcon from "@mui/icons-material/Search";

const UsersList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchCommittee, setSearchCommittee] = useState("");
    const [searchRole, setSearchRole] = useState([]);
    const {roles} = useRolesList();
    const {users, loading, pageNumber} = useUsersList(currentPage - 1, searchName, searchCommittee, searchRole);

    return (
        <Card variant={"outlined"} sx={{padding: 0, paddingBottom: 1, flex: 3, minWidth: 300}}>
            <CardContent sx={{padding: 1}}>
                <Box sx={{display: "flex", flexDirection: "row", gap: 1, maxWidth: "100%"}}>
                    <Box sx={{display: "flex", flexDirection: "column", flex: 1, minWidth: 100}}>
                        <FormLabel>Użytkownik</FormLabel>
                        <Input
                            placeholder="Szukaj"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            startDecorator={<SearchIcon/>}
                            size="sm"
                            data-testid={"search-name"}
                        />
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", flex: 1, minWidth: 100}}>
                        <FormLabel>Komitet</FormLabel>
                        <Input
                            placeholder="Szukaj"
                            value={searchCommittee}
                            onChange={(e) => setSearchCommittee(e.target.value)}
                            startDecorator={<SearchIcon/>}
                            size="sm"
                            data-testid={"search-committee"}
                        />
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", flex: 1, minWidth: 100}}>
                        <FormLabel>Rola</FormLabel>
                        <Select
                            native
                            placeholder="Wszystkie"
                            value={searchRole}
                            onChange={(e, newValue) => setSearchRole(newValue)}
                            size="sm"
                            data-testid={"search-role"}
                        >
                            <Option value="">Wszystkie</Option>
                            {roles.map(role => (
                                <Option key={role.id} value={role.name} data-testid={`role-option-${role.name}`}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <List variant={"plain"} sx={{paddingBottom: 0}} data-testid={"users-table"}>
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