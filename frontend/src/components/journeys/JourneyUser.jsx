import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";

const JourneyUser = ({user}) => {
    return (
        <Card variant={"solid"} invertedColors color="primary" sx={{flex: 1}}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Użytkownik</Typography>
                    <Typography level={"body-sm"}>Osoba rozpoczynająca kontakt z firmą</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    <Typography>{user.name} {user.surname}</Typography>
                    <Typography>{user.email}</Typography>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default JourneyUser;