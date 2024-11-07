import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
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
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneyTable from "./JourneyTable";
import {useUserJourneyList} from "../../data/JourneyData";
import JourneyDetails, {contactStatusOptions} from "./JourneyDetails";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";
import SearchIcon from "@mui/icons-material/Search";
import Option from "@mui/joy/Option";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/joy/Button";
import {useSearchWithPagination} from "../../utils/SearchHook";

const COMPANY_NAME = "companyName";
const STATUS = "status";
const DETAILED_STATUS = "detailedStatus";
const CURRENT_PAGE = "currentPage";
const SORT = "sort";
const EVENT_TEXT = "eventText";
const PAGE_SIZE = "pageSize";

const UserJourneysHome = () => {

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
        [{name: "sort", value: "companyName,ASC"}, {name: PAGE_SIZE, value: 10}])
    const {journeys, loading, totalCount, pagesNumber}
        = useUserJourneyList(currentPage - 1, search, searchLoaded);

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
                <Input value={searchNotSubmittedValue.companyName || ""}
                       onChange={(e) => {
                           updateSearch(COMPANY_NAME, e.target.value)
                       }}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>
                    Status
                </FormLabel>
                <Select value={searchNotSubmittedValue.status || ""}
                        onChange={(e, value) => {
                            updateSearch(STATUS, value);
                        }}>
                    <Option value={"in-progress"}>W trakcie</Option>
                    <Option value={"finished"}>Zakończone</Option>
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>
                    Dokładny status
                </FormLabel>
                <Select value={searchNotSubmittedValue.detailedStatus || ""}
                        onChange={(e, value) => {
                            updateSearch(DETAILED_STATUS, value);
                        }}>
                    {contactStatusOptions.map(option => {
                        return <Option key={option.name} value={option.name}>{option.text}</Option>
                    })}
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Wydarzenie kontaktowe</FormLabel>
                <Input value={searchNotSubmittedValue.eventText || ""}
                       onChange={(e) => {
                           updateSearch(EVENT_TEXT, e.target.value)
                       }}
                       size="sm" placeholder="Opis"
                       startDecorator={<PersonIcon/>}/>
            </FormControl>
            <div>
                <Button size={"sm"} type={"submit"}>Szukaj</Button>
            </div>
        </form>
    }

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Twoje kontakty</Typography>
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
                    <LinearProgress style={{visibility: loading ? "visible" : "hidden"}}/>

                    {!loading &&
                        <JourneyTable journeys={journeys} search={search} clearSort={clearSort}
                                      updateSort={updateSort} numberOfItems={totalCount} setItemsPerPage={(count) => {
                            updateSearch(PAGE_SIZE, count);
                        }} itemsPerPage={search.pageSize}/>}
                    {loading && <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                        {Array(10).fill(0).map((value, i) => {
                            return <Skeleton key={i} variant={"rectangular"} style={{height: 30}}/>
                        })}
                    </div>}

                    {pagesNumber > 1 &&
                        <Pagination currentPage={currentPage} numberOfPages={pagesNumber} firstAndLast={!mobile}
                                    concise={mobile} setPage={(page) => updateCurrentPage(page)}
                                    margin={"10px 0 10px 0"}
                        />}
                </div>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default UserJourneysHome;