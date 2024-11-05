import React, {useEffect} from 'react';
import TabHeader from "../main/TabHeader";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    FormControl,
    FormLabel,
    Input,
    LinearProgress,
    Select,
    Skeleton,
    Typography
} from "@mui/joy";
import JourneyTable from "./JourneyTable";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";
import {useCurrentCampaignJourneyList} from "../../data/JourneyData";
import SearchIcon from "@mui/icons-material/Search";
import Option from "@mui/joy/Option";
import {contactStatusOptions} from "./JourneyDetails";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/joy/Button";
import {useSearchWithPagination} from "../../utils/SearchHook";

const COMPANY_NAME = "companyName";
const STATUS = "status";
const DETAILED_STATUS = "detailedStatus";
const USER = "user";
const CURRENT_PAGE = "currentPage";
const PAGE_SIZE = "pageSize";
const EVENT_TEXT = "eventText";
const SORT = "sort";

const JourneyList = () => {
    const mobile = useMobileSize();
    const {
        search,
        searchNotSubmittedValue,
        searchLoaded,
        currentPage,
        updateSearch,
        updateSort,
        clearSort,
        applySearch,
        updateCurrentPage,
        updatePageNumber
    } = useSearchWithPagination([COMPANY_NAME, STATUS, DETAILED_STATUS, CURRENT_PAGE, SORT, EVENT_TEXT, PAGE_SIZE],
        [{name: SORT, value: "companyName,ASC"}, {name: PAGE_SIZE, value: 10}]);

    const {journeys, loading, totalCount, pagesNumber}
        = useCurrentCampaignJourneyList(currentPage - 1, search, searchLoaded);

    useEffect(() => {
        updatePageNumber(pagesNumber);
    }, [loading]);

    const renderFilters = () => {
        return <form onSubmit={e => {
            e.preventDefault();
            applySearch();
        }} style={{
            marginBottom: 5,
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            alignItems: "flex-end"
        }}>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Szukaj firmy</FormLabel>
                <Input data-testid="journey-search-company-name"
                       value={searchNotSubmittedValue.companyName || ""}
                       onChange={(e) => {
                           updateSearch(COMPANY_NAME, e.target.value);
                       }}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>
                    Statusz
                </FormLabel>
                <Select data-testid="journey-search-status"
                        value={searchNotSubmittedValue.status || ""}
                        onChange={(e, value) => {
                            updateSearch(STATUS, value);
                        }}>
                    <Option data-testid="journey-search-status-in-progress" value={"in-progress"}>W trakcie</Option>
                    <Option data-testid="journey-search-status-finished" value={"finished"}>Zakończone</Option>
                    <Option data-testid="journey-search-status-all" value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>
                    Dokładny status
                </FormLabel>
                <Select data-testid="journey-search-detailed-status"
                        value={searchNotSubmittedValue.detailedStatus || ""}
                        onChange={(e, value) => {
                            updateSearch(DETAILED_STATUS, value);
                        }}>
                    {contactStatusOptions.map(option => {
                        return <Option data-testid={`journey-search-detailed-status-${option.name}`}
                                       key={option.name} value={option.name}>
                            {option.text}
                        </Option>
                    })}
                    <Option data-testid={`journey-search-detailed-status-all`} value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Użytkownik</FormLabel>
                <Input data-testid="journey-search-user-name"
                       value={searchNotSubmittedValue.user || ""}
                       onChange={(e) => {
                           updateSearch(USER, e.target.value);
                       }}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<PersonIcon/>}/>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Wydarzenie kontaktowe</FormLabel>
                <Input data-testid="journey-search-contact-event-text"
                       value={searchNotSubmittedValue.eventText || ""}
                       onChange={(e) => {
                           updateSearch(EVENT_TEXT, e.target.value);
                       }}
                       size="sm" placeholder="Opis"
                       startDecorator={<PersonIcon/>}/>
            </FormControl>
            <div>
                <Button data-testid="journey-search-button" size={"sm"} type={"submit"}>Szukaj</Button>
            </div>
        </form>
    }

    return (
        <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
            <TabHeader>
                <Typography level="h2">Kontakty w obecnej akcji</Typography>
            </TabHeader>

            {mobile ? <AccordionGroup variant={"outlined"} transion={"0.2s ease"} sx={{
                borderRadius: 'sm', marginBottom: 1
            }}>
                <Accordion>
                    <AccordionSummary>Filtry</AccordionSummary>
                    <AccordionDetails>
                        {renderFilters()}
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup> : renderFilters()}

            <LinearProgress sx={{visibility: loading ? "visible" : "hidden", marginBottom: '5px'}}/>

            {!loading &&
                <JourneyTable journeys={journeys} search={search} clearSort={clearSort} updateSort={updateSort}
                              numberOfItems={totalCount} setItemsPerPage={(count) => {
                    updateSearch(PAGE_SIZE, count);
                }} itemsPerPage={search.pageSize}/>}
            {loading && <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                {Array(10).fill(0).map((value, i) => {
                    return <Skeleton key={i} variant={"rectangular"} style={{height: 30}}/>
                })}
            </div>}
            {pagesNumber > 1 &&
                <Pagination currentPage={currentPage} numberOfPages={pagesNumber} firstAndLast={!mobile}
                            concise={mobile}
                            margin={"10px 0 10px 0"}
                            setPage={(page) => updateCurrentPage(page)}/>}
        </div>
    );
};

export default JourneyList;