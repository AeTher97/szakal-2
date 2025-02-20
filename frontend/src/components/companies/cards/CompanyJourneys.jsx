import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import LinkWithRouter from "../../misc/LinkWithRouter";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";
import PropTypes from "prop-types";
import UserAvatar from "../../misc/UserAvatar";

const CompanyJourneys = ({localCompany}) => {

    return (
        <Card sx={{flex: 1, minWidth: 250}} variant={"soft"}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Kontakty</Typography>
                    <Typography level={"body-sm"}>Historia poprzednich kontaktów</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    {localCompany.contactJourneys.map((journey, i) => <div key={journey.id}
                                                                           style={{
                                                                               display: "flex",
                                                                               flexDirection: "column"
                                                                           }}>
                        <LinkWithRouter
                            to={`/secure/journeys/${journey.id}`}>{journey.campaign.name} {contactStatusUtils(journey.contactStatus)}</LinkWithRouter>
                        {journey.user ? <UserAvatar id={journey.user.id} name={journey.user.name}
                                                    surname={journey.user.surname} committee={journey.user.committee}/>
                            : "Brak przypisanego użytkownika"}
                        {i !== localCompany.contactJourneys.length - 1 && <Divider inset={"context"}/>}
                    </div>)}
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

CompanyJourneys.propTypes = {
    localCompany: PropTypes.object.isRequired
}

export default CompanyJourneys;