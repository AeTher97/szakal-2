import React from 'react';
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

const BasicUserInfo = ({user, localUser}) => {

    const mobile = useMobileSize();


    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 200 : 450, flex: 1, display: "flex"}} color={"primary"}
              variant={"solid"}
              invertedColors>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Informacje</Typography>
                <Typography level={"body-sm"}>Detale na temat użytkownika</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
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
                                    <Input style={{width: 180}} placeholder={"Imię"} value={localUser.name}/>
                                </FormControl>
                                <FormControl>
                                    <Input placeholder={"Nazwisko"} value={localUser.surname}/>
                                </FormControl>
                            </div>
                            <FormLabel>
                                <Typography level={"title-sm"}>Email</Typography>
                            </FormLabel>
                            <FormControl>
                                <div style={{display: "flex", flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
                                    <Input placeholder={"Email"} value={localUser.email}/>
                                </div>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button>Zapisz</Button>
                </CardActions>
            </form>
        </Card>
    )
};

export default BasicUserInfo;