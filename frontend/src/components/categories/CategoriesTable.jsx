import React from 'react';
import {Sheet, Table, Typography} from "@mui/joy";

const CategoriesTable = ({categories}) => {


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
                        <Typography>Nazwa</Typography>
                    </th>
                </tr>
                </thead>
                <tbody>
                {categories && categories.map(category =>
                    <tr key={category.id}>
                        <td>{category.name}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default CategoriesTable;