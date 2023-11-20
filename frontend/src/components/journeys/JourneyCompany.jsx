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
                    <Typography>Nazwa: <LinkWithRouter to={`/secure/companies/${company.id}`}>{company.name}
                    </LinkWithRouter>
                    </Typography>
                    <Typography>Email: {company.email}</Typography>
                    <Typography>Adres: {company.address.city} {company.address.street} {company.address.postalCode}</Typography>
                    <Typography>Strona: {company.www}</Typography>
                    <Typography>Telefon: {company.phone}</Typography>
                    <Typography>Branże: {company.categories.map(category => <Typography key={category.id}>
                        {category.name}
                    </Typography>)}
                    </Typography>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default JourneyCompany;