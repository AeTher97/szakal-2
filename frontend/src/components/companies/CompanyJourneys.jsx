import React from 'react';
import {Card, Typography} from "@mui/joy";

const CompanyJourneys = ({localCompany}) => {


    return (
        <Card>
            {localCompany.contactJourneys.map(journey => <Typography>journey</Typography>)}
        </Card>
    );
};

export default CompanyJourneys;