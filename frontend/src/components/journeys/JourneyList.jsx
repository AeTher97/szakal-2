import React from 'react';
import {IconButton, Link, Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../misc/LinkWithRouter";
import {contactStatusUtils} from "../../utils/ContactStatusUtils";
import Button from "@mui/joy/Button";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import {formatLocalDate} from "../../utils/DateUtils";
import {useMediumSize, useMobileSize} from "../../utils/MediaQuery";
import {itemsPerPageValues} from "../companies/CompanyList";
import PropTypes from "prop-types";

const JourneyList = ({
                         journeys,
                         search,
                         updateSort,
                         clearSort,
                         numberOfItems,
                         setItemsPerPage,
                         itemsPerPage
                     }) => {

    const mediumSize = useMediumSize();
    const mobile = useMobileSize();

    const sortedByCompany = search && search.sort && search.sort.includes("companyName");
    const sortedByUser = search && search.sort && search.sort.includes("user");
    const sortedByStatus = search && search.sort && search.sort.includes("detailedStatus");
    const sortedByStartDate = search && search.sort && search.sort.includes("startDate");
    const sortedByLastInteractionDate = search && search.sort && search.sort.includes("lastInteraction");

    const directionAscending = search && search.sort && search.sort.includes("ASC");

    const getSortingProperty = (journey) => {
        if (sortedByCompany) {
            return journey.company.name;
        } else if (sortedByUser) {
            if (!journey.user) {
                return "Z"
            }
            return journey.user.surname;
        } else if (sortedByStatus) {
            return contactStatusUtils(journey.contactStatus);
        } else if (sortedByStartDate) {
            return journey.journeyStart;
        } else if (sortedByLastInteractionDate) {
            const directionAscendingProperty = directionAscending ? "4000" : "0"
            return journey.lastInteraction || directionAscendingProperty;
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
                            <Button data-testid={"journeys-sort-by-company-name"}
                                    variant={"plain"}
                                    size={"sm"}
                                    style={sortedByCompany ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("companyName", directionAscending ? "DESC" : "ASC")}>
                                Firma {sortedByCompany && directionAscending && <KeyboardArrowUp/>}
                                {sortedByCompany && !directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByCompany &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                    <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button data-testid={"journeys-sort-by-user-name"}
                                    variant={"plain"}
                                    size={"sm"}
                                    style={sortedByUser ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("user", directionAscending ? "DESC" : "ASC")}>
                                Użytkownik {sortedByUser && directionAscending && <KeyboardArrowUp/>}
                                {sortedByUser && !directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByUser &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                    {!mobile && <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button data-testid={"journeys-sort-by-start-date"}
                                    variant={"plain"}
                                    size={"sm"}
                                    style={sortedByUser ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("startDate", directionAscending ? "DESC" : "ASC")}>
                                Data rozpoczęcia {sortedByStartDate && directionAscending && <KeyboardArrowUp/>}
                                {sortedByStartDate && !directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByStartDate &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>}
                    {!mediumSize && <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button data-testid={"journeys-sort-by-last-interaction-date"}
                                    variant={"plain"}
                                    size={"sm"}
                                    style={sortedByLastInteractionDate ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("lastInteraction", directionAscending ? "DESC" : "ASC")}>
                                Ostatnia interakcja {sortedByLastInteractionDate && directionAscending &&
                                <KeyboardArrowUp/>}
                                {sortedByLastInteractionDate && !directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByLastInteractionDate &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>}
                    <th style={{padding: "8px 0px"}}>
                        <div style={{display: "flex"}}>
                            <Button data-testid={"journeys-sort-by-status"}
                                    variant={"plain"}
                                    size={"sm"}
                                    style={sortedByStatus ? {paddingRight: 2} : {}}
                                    onClick={() => updateSort("detailedStatus", directionAscending ? "DESC" : "ASC")}>
                                Status {sortedByStatus && directionAscending && <KeyboardArrowUp/>}
                                {sortedByStatus && !directionAscending && <KeyboardArrowDown/>}</Button>
                            {sortedByStatus &&
                                <IconButton color={"warning"} size={"sm"} onClick={clearSort}><ClearIcon/></IconButton>}
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody data-testid={`journey-table`}>
                {journeys?.map(journey =>
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
                        {!mobile && <td>
                            <Typography sx={theme => ({
                                color: `${!journey.finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                            })}>{formatLocalDate(journey.journeyStart)}</Typography>
                        </td>}
                        {!mediumSize && <td>
                            <Typography sx={theme => ({
                                color: `${!journey.finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                            })}>{journey.lastInteraction ? formatLocalDate(journey.lastInteraction) : "Brak interakcji"}</Typography>
                        </td>}
                        <td><Typography style={{wordBreak: "break-word"}} sx={theme => ({
                            color: `${!journey.finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                        })}>{contactStatusUtils(journey.contactStatus)} {journey.finished ? "(Zakończony)" : ""}
                        </Typography><
                        /td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <td>
                        Liczba elementów: {numberOfItems}
                    </td>
                    <td/>
                    {!mobile && <td/>}
                    {!mediumSize && <td/>}
                    <td>
                        <div style={{display: "flex", gap: 5, flexWrap: "wrap"}}>
                            Elementów na stronę:
                            {Array(3).fill(0).map((value, i) => {
                                return <Link data-testid={`items-per-page-${itemsPerPageValues[i]}`}
                                             key={itemsPerPageValues[i]}
                                             onClick={() => setItemsPerPage(itemsPerPageValues[i])}
                                             underline={(itemsPerPageValues[i] === itemsPerPage ||
                                                 itemsPerPageValues[i] === Number(itemsPerPage))
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

JourneyList.propTypes = {
    journeys: PropTypes.array.isRequired,
    search: PropTypes.object.isRequired,
    updateSort: PropTypes.func.isRequired,
    clearSort: PropTypes.func.isRequired,
    numberOfItems: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    setItemsPerPage: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default JourneyList;