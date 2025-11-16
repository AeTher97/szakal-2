import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import LinkWithRouter from "../../misc/LinkWithRouter";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";
import PropTypes from "prop-types";
import UserAvatar from "../../misc/UserAvatar";
import {useMobileSize} from "../../../utils/MediaQuery";

const CompanyJourneys = ({localCompany}) => {

    const mobile = useMobileSize();

    return (
        <Card sx={{flex: 1, minWidth: mobile ? 250 : 800}} variant={"soft"}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Kontakty</Typography>
                    <Typography level={"body-sm"}>Historia poprzednich kontaktów</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent style={{paddingTop: 0}}>
                    {localCompany.contactJourneys.map((journey, i) =>
                        <div key={journey.id}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: mobile ? "column" : "row",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    paddingBottom: 10,
                                    paddingTop: 10
                                }}>
                                {journey.user ?
                                    <UserAvatar id={journey.user.id} name={journey.user.name} email={journey.user.email}
                                                surname={journey.user.surname} committee={journey.user.committee}
                                                size={"sm"} overrideMobile={true}/>
                                    : "Brak przypisanego użytkownika"}
                                <LinkWithRouter
                                    to={`/secure/journeys/${journey.id}`}>{journey.campaign.name} - {contactStatusUtils(journey.contactStatus)}
                                </LinkWithRouter>
                            </div>
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