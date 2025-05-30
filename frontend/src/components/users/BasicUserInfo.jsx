import React, {useEffect, useState} from 'react';
import {Avatar, Card, CardActions, CardContent, Divider, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useMobileSize} from "../../utils/MediaQuery";
import {useSelector} from "react-redux";
import ProfilePictureDialog from "./ProfilePictureDialog";
import {uuidToColor} from "../../utils/ColorForUUID";
import PropTypes from "prop-types";
import {InputWithLimit} from "../misc/InputWithLimit";
import {UseFieldValidation} from "../../utils/UseFieldValidation";
import {UseFormValidation} from "../../utils/UseFormValidation";

const BasicUserInfo = ({
                           user,
                           localUser,
                           updateUserDetails,
                           updateUserDetailsLoading,
                           updateProfilePicture,
                           updatePictureLoading,
                       }) => {

    const mobile = useMobileSize();

    const name = UseFieldValidation();
    const surname = UseFieldValidation();
    const email = UseFieldValidation();
    const committee = UseFieldValidation();
    const [profilePictureDialogOpen, setProfilePictureDialogOpen] = useState(false);
    const {userId} = useSelector(state => state.auth);

    const isUser = userId === user.id;
    const isFormValid = UseFormValidation([name, surname, email]);

    useEffect(() => {
        if (localUser) {
            name.setValue(localUser.name);
            surname.setValue(localUser.surname);
            email.setValue(localUser.email);
            committee.setValue(localUser.committee);
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
                updateUserDetails(name.value, surname.value, email.value, committee.value)
            }}>
                <CardContent orientation={mobile ? "vertical" : "horizontal"}
                             style={{justifyContent: mobile ? "center" : "flex-start"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 20
                    }}>
                        <Avatar
                            size={"lg"}
                            sx={{
                                width: mobile ? 175 : 100,
                                height: mobile ? 175 : 100
                            }}
                                style={{backgroundColor: uuidToColor(user.id)}}
                            src={updatePictureLoading ? null :
                                `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/${user.id}/picture`}>
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
                                <InputWithLimit disabled={!isUser}
                                                placeholder={"Imię"}
                                                value={name.value}
                                                limit={name.limit}
                                                isValid={name.isValid}
                                                formControlProps={{style: {flex: 1}}}
                                                onChange={name.handleChange}/>
                                <InputWithLimit disabled={!isUser}
                                                placeholder={"Nazwisko"}
                                                value={surname.value}
                                                limit={surname.limit}
                                                isValid={surname.isValid}
                                                formControlProps={{style: {flex: 1}}}
                                                onChange={surname.handleChange}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
                                <InputWithLimit label={"Email"} disabled={!isUser}
                                                placeholder={"Email"}
                                                value={email.value}
                                                limit={email.limit}
                                                isValid={email.isValid}
                                                onChange={email.handleChange}
                                                formControlProps={{style: {flex: 1}}}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
                                <InputWithLimit label={"Komitet"} disabled={!isUser}
                                                placeholder={"AGH"}
                                                value={committee.value}
                                                limit={committee.limit}
                                                isValid={committee.isValid}
                                                onChange={committee.handleChange}
                                                formControlProps={{style: {flex: 1}}}/>
                            </div>
                        </Stack>
                    </div>

                </CardContent>
                {isUser && <CardActions>
                    <Button type={"submit"} loading={updateUserDetailsLoading} disabled={!isFormValid}>Zapisz</Button>
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

BasicUserInfo.propTypes = {
    user: PropTypes.object.isRequired,
    localUser: PropTypes.object.isRequired,
    updateUserDetails: PropTypes.func.isRequired,
    updateUserDetailsLoading: PropTypes.bool.isRequired,
    updateProfilePicture: PropTypes.func.isRequired,
    updatePictureLoading: PropTypes.bool
}

export default BasicUserInfo;