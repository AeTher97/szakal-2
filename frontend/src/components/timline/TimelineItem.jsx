import React from 'react';
import TimelineDot from "./TimelineDot";
import {Card} from "@mui/joy";
import TimelineConnector from "./TimelineConnector";

const TimelineItem = ({children}) => {
    return (
        <div style={{display: "flex", alignItems: "center", gap: 5}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch"}}>
                <TimelineConnector/>
                <TimelineDot/>
                <TimelineConnector top/>
            </div>
            <Card sx={{flex: 1, marginTop: 1, marginBottom: 1, padding: 1, gap: 0}}>
                {children}
            </Card>
        </div>
    );
};

export default TimelineItem;