import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";

const JourneysTable = ({journeys}) => {

    const mobile = useMobileSize();

    return (
        <Sheet sx={{
            width: '100%',
            borderRadius: 'sm',
            overflow: 'auto',
            display: "flex",
        }}>
            <Table
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                }}>
                <thead>
                <tr>
                    <th>
                        <Typography>Firma</Typography>
                    </th>
                    <th>
                        <Typography>Użytkownik</Typography>
                    </th>
                    <th>
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
                        <td>{journey.contactStatus}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default JourneysTable;