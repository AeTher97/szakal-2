import React from 'react';
import {Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useMobileSize} from "../../utils/SizeQuery";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import {formatLocalDateTime} from "../../utils/DateUtils";


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
                    {!mobile && <th style={{padding: "12px 6px"}}>
                        <Typography>Kategorie</Typography>
                    </th>}
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
                                <LinkWithRouter to={`/secure/journeys/${company.currentJourney.id}`}>
                                    <Typography>
                                        {decodeContactStatus(company.currentJourney.contactStatus)}
                                    </Typography>
                                </LinkWithRouter>
                                <Typography>{company.currentJourney.user.name} {company.currentJourney.user.surname}</Typography>
                                <Typography>{formatLocalDateTime(company.currentJourney.journeyStart)}</Typography>
                            </div>
                            : <Typography>Wolna</Typography>}</td>
                        {!mobile && <td>
                            {company.categories.map(category => {
                                return <Typography key={category.id}>{category.name}</Typography>
                            })}
                        </td>}
                        {!mobile && <td>
                            {company.contactJourneys && company.contactJourneys.map(journey => {
                                return <div key={journey.id}>
                                    <LinkWithRouter to={`/secure/journeys/${journey.id}`}>
                                        <Typography key={journey.campaignName}>
                                            {journey.campaignName}
                                        </Typography>
                                    </LinkWithRouter>
                                    <Typography>
                                        {decodeContactStatus(journey.status)}
                                    </Typography>
                                </div>
                            })}
                            {(!company.contactJourneys || company.contactJourneys.length === 0) &&
                                <Typography>Nie kontaktowano się z firmą</Typography>}
                        </td>}
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default CompaniesTable;