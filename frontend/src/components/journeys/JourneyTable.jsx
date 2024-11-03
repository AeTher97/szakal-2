import React from 'react';
import {IconButton, Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import Button from "@mui/joy/Button";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";

const JourneyTable = ({journeys, search, updateSort, clearSort}) => {

    const sortedByCompany = search && search.sort && search.sort.includes("companyName")
    const sortedByUser = search && search.sort && search.sort.includes("user")
    const sortedByStatus = search && search.sort && search.sort.includes("detailedStatus")

    const directionAscending = search && search.sort && search.sort.includes("ASC");

    const getSortingProperty = (journey) => {
        if (sortedByCompany) {
            return journey.company.name;
        } else if (sortedByUser) {
            return journey.user.surname;
        } else if (sortedByStatus) {
            return decodeContactStatus(journey.contactStatus);
        }
    }

    journeys = journeys.sort((a, b) => {
        if (getSortingProperty(a) > getSortingProperty(b)) {
            return directionAscending ? 1 : -1;
        } else if (getSortingProperty(a) < getSortingProperty(b)) {
            return directionAscending ? -1 : 1;
        } else {
            return 0
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
                            <Button variant={"plain"} size={"sm"} style={sortedByCompany ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("companyName", directionAscending ? "DESC" : "ASC")}>
                                Firma {sortedByCompany && !directionAscending && <KeyboardArrowUp/>}
                                {sortedByCompany && directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByCompany &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                    <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button variant={"plain"} size={"sm"} style={sortedByUser ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("user", directionAscending ? "DESC" : "ASC")}>
                                Użytkownik {sortedByUser && !directionAscending && <KeyboardArrowUp/>}
                                {sortedByUser && directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByUser &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                    <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button variant={"plain"} size={"sm"} style={sortedByStatus ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("detailedStatus", directionAscending ? "DESC" : "ASC")}>
                                Status {sortedByStatus && !directionAscending && <KeyboardArrowUp/>}
                                {sortedByStatus && directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByStatus &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {journeys && journeys.map(journey =>
                    <tr key={journey.id}>
                        <td>
                            <LinkWithRouter style={{wordBreak: "break-word"}}
                                            to={journey.id}
                                            sx={theme => ({
                                                color: `${!journey.finished ? theme.vars.palette.primary
                                                    : theme.vars.palette.primary["600"]}`
                                            })}
                            >{journey.company.name}
                            </LinkWithRouter>
                        </td>
                        <td>
                            <Typography style={{wordBreak: "break-word"}} sx={theme => ({
                                color: `${!journey.finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                            })}>{journey.user ? journey.user.name : "Brak przypisanego użytkownika"} {journey.user ? journey.user.surname : ""}</Typography>
                        </td>
                        <td><Typography style={{wordBreak: "break-word"}} sx={theme => ({
                            color: `${!journey.finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                        })}>{decodeContactStatus(journey.contactStatus)} {journey.finished ? "(Zakończony)" : ""}
                        </Typography><
                        /td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default JourneyTable;