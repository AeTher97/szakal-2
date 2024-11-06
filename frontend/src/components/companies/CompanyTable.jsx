import React from 'react';
import {Link, Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useMobileSize} from "../../utils/SizeQuery";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import {formatLocalDateTime} from "../../utils/DateUtils";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import Button from "@mui/joy/Button";

export const itemsPerPageValues = [10, 20, 50];

const CompanyTable = ({companies, search, updateSort, numberOfItems, setItemsPerPage, itemsPerPage}) => {

    const mobile = useMobileSize();

    const sorted = search && search.sort;
    const directionAscending = sorted && search.sort.includes("ASC");

    companies = companies.sort((a, b) => {
        if (a.name < b.name) {
            return directionAscending ? -1 : 1;
        } else if (a.name > b.name) {
            return directionAscending ? 1 : -1
        } else {
            return 0;
        }
    })


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
                    <th style={{padding: "8px 6px"}}>
                        <div style={{display: "flex"}}>
                            <Button variant={"plain"} size={"sm"} style={sorted ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("name", directionAscending ? "DESC" : "ASC")}>
                                Firma {sorted && directionAscending && <KeyboardArrowUp/>}
                                {sorted && !directionAscending && <KeyboardArrowDown/>}</Button>
                        </div>
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
                                <LinkWithRouter style={{wordBreak: "break-word"}}
                                                to={`${company.id}${window.location.search}`}>{company.name}</LinkWithRouter>
                                <Typography style={{wordBreak: "break-word"}}>{company.www}</Typography>
                                <Typography style={{wordBreak: "break-word"}}>{company.email}</Typography>
                            </div>
                        </td>
                        <td>{company.currentJourney ? <div>
                                <LinkWithRouter to={`/secure/journeys/${company.currentJourney.id}`}>
                                    <Typography style={{wordBreak: "break-word"}}>
                                        {decodeContactStatus(company.currentJourney.status)}
                                    </Typography>
                                </LinkWithRouter>
                                <Typography style={{wordBreak: "break-word"}}>{company.currentJourney.user ?
                                    `${company.currentJourney.user.name} ${company.currentJourney.user.surname}`
                                    : "Brak przypisanego użytkownika"}
                                </Typography>
                                <Typography>{formatLocalDateTime(company.currentJourney.journeyStart)}</Typography>
                            </div>
                            : <Typography>Wolna</Typography>}</td>
                        {!mobile && <td>
                            {company.categories.map((category, i) => {
                                return <Typography
                                    key={category.id}>{category.name}{i !== company.categories.length - 1 ? "," : ""}</Typography>
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
                <tfoot>
                <tr>
                    <td>
                        Liczba elementów: {numberOfItems}
                    </td>
                    {!mobile && <td/>}
                    {!mobile && <td/>}
                    <td>
                        <div style={{display: "flex", gap: 5}}>
                            Elementów na stronę:
                            {Array(3).fill(0).map((value, i) => {
                                return <Link key={i} onClick={() => setItemsPerPage(itemsPerPageValues[i])}
                                             underline={(itemsPerPageValues[i] === itemsPerPage || itemsPerPageValues[i] === Number(itemsPerPage))
                                                 ? "always" : "hover"}>{itemsPerPageValues[i]}</Link>
                            })}

                        </div>
                    </td>
                </tr>
                </tfoot>
            </Table>
        </Sheet>
    );
};

export default CompanyTable;