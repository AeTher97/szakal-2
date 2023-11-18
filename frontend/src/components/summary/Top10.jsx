import React from 'react';
import {Card, CardContent, Typography} from "@mui/joy";
import {CardHeader} from "@mui/material";

const Top10 = () => {
    return (
        <Card>
            <CardHeader><Typography>Top 10 graczy</Typography></CardHeader>
            <CardContent>
                <Typography>1. Ja</Typography>
                <Typography>2. Ty</Typography>
            </CardContent>
        </Card>
    );
};

export default Top10;