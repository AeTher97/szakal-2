import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import UserAvatar from "../UserAvatar";

const JourneyUser = ({user}) => {
    return (
        <Card variant={"solid"} invertedColors color="primary" sx={{flex: 1}}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Użytkownik</Typography>
                    <Typography level={"body-sm"}>Osoba rozpoczynająca kontakt z firmą</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                {user && <CardContent>
                    <UserAvatar name={user.name} surname={user.surname} id={user.id}
                                image={user.profilePicture} overrideMobile/>
                    <Typography>{user.email}</Typography>
                </CardContent>}
                {!user &&
                    <CardContent>
                        <Typography>Brak przypisanego użytkownika</Typography>
                    </CardContent>}
            </CardOverflow>
        </Card>
    );
};

export default JourneyUser;