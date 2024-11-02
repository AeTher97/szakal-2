import React, {useEffect, useState} from 'react';
import {Avatar, Card, CardActions, CardContent, Divider, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/SizeQuery";
import {useSelector} from "react-redux";
import ProfilePictureDialog from "./ProfilePictureDialog";
import InputWithLimit from "../../utils/InputWithLimit";
import {uuidToColor} from "../../utils/ColorForUUID";

const BasicUserInfo = ({user, localUser, updateUserDetails, updateUserDetailsLoading, updateProfilePicture}) => {

    const mobile = useMobileSize();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [profilePictureDialogOpen, setProfilePictureDialogOpen] = useState(false);
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
                <CardContent orientation={mobile ? "vertical" : "horizontal"}
                             style={{justifyContent: mobile ? "center" : "flex-start"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20
                    }}>
                        <Avatar size={"lg"} sx={{width: mobile ? 150 : 80, height: mobile ? 150 : 80}}
                                style={{backgroundColor: uuidToColor(user.id)}}
                                src={user.profilePicture ? `data:image;base64,${user.profilePicture}` : ""}>
                            <Typography level={mobile ? "h1" : null}>
                                {user.name[0]} {user.surname[0]}
                            </Typography>
                        </Avatar>
                        {isUser && <Button size={"sm"} onClick={() => setProfilePictureDialogOpen(true)}>Zmień</Button>}
                    </div>

                    <div>
                        <FormLabel>
                            <Typography level={"title-sm"}>Imię i Nazwisko</Typography>
                        </FormLabel>
                        <Stack spacing={1}>
                            <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                                <InputWithLimit disabled={!isUser} placeholder={"Imię"}
                                                value={name}
                                                formControlProps={{style: {flex: 1}}}
                                                onChange={(e) => {
                                                    setName(e.target.value)
                                                }}/>
                                <InputWithLimit disabled={!isUser}
                                                placeholder={"Nazwisko"}
                                                value={surname}
                                                formControlProps={{style: {flex: 1}}}
                                                onChange={(e) => {
                                                    setSurname(e.target.value)
                                                }}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
                                <InputWithLimit label={"Email"} disabled={!isUser} placeholder={"Email"}
                                                value={email} onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                                formControlProps={{style: {flex: 1}}}/>
                            </div>
                        </Stack>
                    </div>

                </CardContent>
                {isUser && <CardActions>
                    <Button type={"submit"} loading={updateUserDetailsLoading}>Zapisz</Button>
                </CardActions>}
                <ProfilePictureDialog
                    open={profilePictureDialogOpen}
                    close={() => setProfilePictureDialogOpen(false)}
                    updateProfilePicture={updateProfilePicture}
                />
            </form>
        </Card>
    )
};

export default BasicUserInfo;