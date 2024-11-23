import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../../utils/DateUtils";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";
import PropTypes from "prop-types";

const JourneyInfo = ({journey}) => {

    return (
        <Card variant={"soft"} sx={{flex: 1}}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Kontakt</Typography>
                    <Typography level={"body-sm"}>Podstawowe informacje</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    <div style={{display: "flex", gap: 10}}>
                        <Typography
                            level={"title-md"}>Akcja</Typography><Typography>{journey.campaign.name}</Typography>
                    </div>
                    <div style={{display: "flex", gap: 10}}>
                        <Typography
                            level={"title-md"}>Status</Typography><Typography>{contactStatusUtils(journey.contactStatus)}
                        {journey.finished ? ", (Zakończony)" : ""}</Typography>
                    </div>
                    <div style={{display: "flex", gap: 10}}>
                        <Typography
                            level={"title-md"}>Rozpoczęto</Typography><Typography>{formatLocalDateTime(journey.journeyStart)}</Typography>
                    </div>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

JourneyInfo.propTypes = {
    journey: PropTypes.object.isRequired
}

export default JourneyInfo;