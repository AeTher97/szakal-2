import React from 'react';
import {Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useMobileSize} from "../../utils/SizeQuery";

const CompaniesTable = ({companies}) => {

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
                        <Typography>Obecna akcja</Typography>
                    </th>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Kategorie</Typography>
                    </th>
                    {!mobile && <th style={{padding: "12px 6px"}}>
                        <Typography>Historia kontaktu</Typography>
                    </th>}
                </tr>
                </thead>
                <tbody>
                {companies && companies.map(company =>
                    <tr key={company.id}>
                        <td>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <LinkWithRouter to={company.id}>{company.name}</LinkWithRouter>
                                <Typography>{company.www}</Typography>
                                <Typography>{company.email}</Typography>
                            </div>
                        </td>
                        <td>{company.currentJourney ? <div>
                                <Typography>{company.currentJourney.contactStatus}</Typography>
                                <Typography>{company.currentJourney.user.name} {company.currentJourney.user.surname}</Typography>
                                <Typography>{company.currentJourney.journeyStart}</Typography>
                            </div>
                            : <Typography>Wolna</Typography>}</td>
                        <td>
                            {company.categories.map(category => {
                                return <Typography key={category.id}>{category.name}</Typography>
                            })}
                        </td>
                        {!mobile && company.contactJourneys &&
                            <td>{company.contactJourneys.map(journey => <Typography key={journey.campaignName}>
                            {journey.campaignName} {journey.status}</Typography>)}</td>}
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default CompaniesTable;