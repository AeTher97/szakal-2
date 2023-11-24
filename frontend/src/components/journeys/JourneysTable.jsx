import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";

const JourneysTable = ({journeys}) => {

    const mobile = useMobileSize();

    return (
        <Sheet sx={{
            borderRadius: 'sm',
            overflow: 'auto',
            display: "flex",
        }}>
            <Table
                variant={"outlined"}
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                    '--TableCell-height': '0px'
                }}>
                <thead>
                <tr>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Firma</Typography>
                    </th>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Użytkownik</Typography>
                    </th>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Status</Typography>
                    </th>
                </tr>
                </thead>
                <tbody>
                {journeys && journeys.map(journey =>
                    <tr key={journey.id}>
                        <td>
                            <LinkWithRouter to={journey.id}>{journey.company.name}
                            </LinkWithRouter>
                        </td>
                        <td>{journey.user.name} {journey.user.surname}</td>
                        <td>{decodeContactStatus(journey.contactStatus)}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default JourneysTable;