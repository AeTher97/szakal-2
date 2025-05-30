import React from 'react';
import {Card, CardContent, CardOverflow, Divider, Link, Typography} from "@mui/joy";
import LinkWithRouter from "../../misc/LinkWithRouter";
import PropTypes from "prop-types";

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
                            <Link
                                href={company.www ? `https://${company.www.replace("https://", "").replace("http://", "")}` : ""}>
                                {company.www}
                            </Link>
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
                        <Typography level={"title-md"}>Kategorie</Typography>
                        <div style={{display: "flex", gap: 5, flexWrap: "wrap"}}>
                            {company.categories.map((category, i) =>
                                <Typography key={category.id}>
                                    {category.name}{i !== company.categories.length - 1 ? "," : ""}
                                </Typography>)}
                        </div>
                    </div>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

JourneyCompany.propTypes = {
    company: PropTypes.object.isRequired
}

export default JourneyCompany;