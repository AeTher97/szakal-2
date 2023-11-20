import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useMobileSize} from "../../utils/SizeQuery";

const CompanyJourneys = ({localCompany}) => {

    const mobile = useMobileSize();

    return (
        <Card sx={{flex: mobile ? 1 : "", minWidth: 250}} variant={"soft"}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Kontakty</Typography>
                    <Typography level={"body-sm"}>Historia kontaktu z poprzednich lat</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    {localCompany.contactJourneys.map((journey, i) => <div
                        style={{display: "flex", flexDirection: "column"}}>
                        <LinkWithRouter>{journey.campaign.name} {journey.contactStatus}</LinkWithRouter>
                        <Typography>{journey.user.name} {journey.user.surname}</Typography>
                        <Typography>Liczba praktykantów: 0</Typography>
                        {i !== localCompany.contactJourneys.length - 1 && <Divider inset={"context"}/>}
                    </div>)}
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default CompanyJourneys;