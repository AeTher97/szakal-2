import React from 'react';
import {Sheet, Table, Typography} from "@mui/joy";
import {formatLocalDate} from "../../utils/DateUtils";

const CampaignsTable = ({campaigns}) => {


    return (
        <Sheet sx={{
            width: '100%',
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
                        <Typography>Nazwa</Typography>
                    </th>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Data rozpoczęcia</Typography>
                    </th>
                </tr>
                </thead>
                <tbody>
                {campaigns && campaigns.map(category =>
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{formatLocalDate(category.startDate)}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default CampaignsTable;