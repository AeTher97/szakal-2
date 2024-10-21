import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";

const JourneyCompany = ({company}) => {
    return (
        <Card color="primary" sx={{flex: 1}}>
            <CardOverflow>
                <CardContent>
                    <Typography level={"title-md"}>Dane firmy</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    <div style={{gap: 10, display: "flex", minWidth: 200}}>
                        <Typography level={"title-md"}>Nazwa</Typography>
                        <LinkWithRouter style={{wordBreak: "break-word"}}
                        to={`/secure/companies/${company.id}`}>{company.name}
                    </LinkWithRouter>
                    </div>
                    <div style={{gap: 10, display: "flex"}}>
                        <Typography>
                            Email
                        </Typography>
                        <Typography style={{wordBreak: "break-word"}}>
                            {company.email}
                        </Typography>
                    </div>
                    <div style={{gap: 10, display: "flex", flex: 1}}>
                        <Typography
                            level={"title-md"}>Adres
                        </Typography>
                        <Typography>
                            {company.address.city} {company.address.street} {company.address.postalCode}
                        </Typography>
                    </div>
                    <div style={{gap: 10, display: "flex"}}>
                        <Typography level={"title-md"}>
                            Strona
                        </Typography>
                        <Typography style={{wordBreak: "break-word"}}>
                            {company.www}
                        </Typography>
                    </div>
                    <div style={{gap: 10, display: "flex"}}>
                        <Typography level={"title-md"}>
                            Telefon
                        </Typography>
                        <Typography style={{wordBreak: "break-word"}}> {company.phone}
                        </Typography>
                    </div>
                    <div style={{gap: 10, display: "flex"}}>
                        <Typography level={"title-md"}>Branże</Typography>
                        <Typography>{company.categories.map(category => <Typography key={category.id}>
                            {category.name}
                        </Typography>)}
                        </Typography>
                    </div>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default JourneyCompany;