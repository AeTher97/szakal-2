import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Typography
} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/SizeQuery";
import {useSelector} from "react-redux";

const BasicUserInfo = ({user, localUser, updateUserDetails, updateUserDetailsLoading}) => {

    const mobile = useMobileSize();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const {userId} = useSelector(state => state.auth);
    const isUser = userId === user.id;

    useEffect(() => {
        if (localUser) {
            setName(localUser.name);
            setSurname(localUser.surname);
            setEmail(localUser.email);
        }
    }, [localUser]);

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 200 : 450, flex: 1, display: "flex"}} color={"primary"}
              variant={"solid"}
              invertedColors>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Informacje</Typography>
                <Typography level={"body-sm"}>Detale na temat użytkownika</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}} onSubmit={(e) => {
                e.preventDefault()
                updateUserDetails(name, surname, email)
            }}>
                <CardContent orientation={"horizontal"} style={{flex: 1, flexWrap: "wrap"}}>
                    <Avatar size={"lg"} sx={{width: 80, height: 80}}>
                        {user.name[0]} {user.surname[0]}
                    </Avatar>

                    <div>
                        <FormLabel>
                            <Typography level={"title-sm"}>Imię i Nazwisko</Typography>
                        </FormLabel>
                        <Stack spacing={1}>
                            <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                                <FormControl>
                                    <Input disabled={!isUser} style={{width: 180}} placeholder={"Imię"} value={name}
                                           onChange={(e) => {
                                               setName(e.target.value)
                                           }}/>
                                </FormControl>
                                <FormControl>
                                    <Input disabled={!isUser} placeholder={"Nazwisko"} value={surname}
                                           onChange={(e) => {
                                        setSurname(e.target.value)
                                    }}/>
                                </FormControl>
                            </div>
                            <FormLabel>
                                <Typography level={"title-sm"}>Email</Typography>
                            </FormLabel>
                            <FormControl>
                                <div style={{display: "flex", flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
                                    <Input disabled={!isUser} placeholder={"Email"} value={email} onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}/>
                                </div>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button type={"submit"} loading={updateUserDetailsLoading}>Zapisz</Button>
                </CardActions>
            </form>
        </Card>
    )
};

export default BasicUserInfo;