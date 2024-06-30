import React, {useEffect, useState} from 'react';
import {Route, Routes, useSearchParams} from "react-router-dom";
import TabHeader from "../main/TabHeader";
import {
    Accordion, AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    FormControl,
    FormLabel,
    Input,
    LinearProgress, Select,
    Typography
} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import JourneysTable from "./JourneysTable";
import {useCurrentCampaignJourneyList} from "../../data/JourneyData";
import JourneyDetails from "./JourneyDetails";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";
import {removeNullFields} from "../../utils/ObjectUtils";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from '@mui/icons-material/Person';
import Button from "@mui/joy/Button";
import Option from "@mui/joy/Option";

const JourneysHome = () => {

    const mobile = useMobileSize();
    const [currentPage, setCurrentPage] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();

    const [tempSearch, setTempSearch] = useState({
        companyName: null,
        status: null,
        user: null
    });

    const [search, setSearch] = useState({
        companyName: null,
        status: null,
        user: null
    });

    const {journeys, loading, pagesNumber} = useCurrentCampaignJourneyList(currentPage - 1, search);


    useEffect(() => {
        const currentValue = {
            companyName: searchParams.get("companyName"),
            status: searchParams.get("status"),
            user: searchParams.get("user"),
        }
        setTempSearch(currentValue)
        setSearch(currentValue);
    }, [searchParams]);


    const renderFilters = () => {
        return <form onSubmit={e => {
            e.preventDefault();
            setSearchParams(removeNullFields(tempSearch));
        }} style={{
            marginBottom: 10,
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            alignItems: "flex-end"
        }}>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Szukaj firmy</FormLabel>
                <Input value={tempSearch.companyName || ""}
                       onChange={(e) => setTempSearch({
                           ...tempSearch,
                           companyName: e.target.value
                       })}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>
                    Status
                </FormLabel>
                <Select value={tempSearch.status || ""}
                        onChange={(e, value) => {
                            setTempSearch({
                                ...search,
                                status: value
                            })
                        }}>
                    <Option value={"in-progress"}>W trakcie</Option>
                    <Option value={"finished"}>Zakończone</Option>
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl sx={{flex: mobile ? 1 : 0}} size="sm">
                <FormLabel>Użytkownik</FormLabel>
                <Input value={tempSearch.user || ""}
                       onChange={(e) => setTempSearch({
                           ...tempSearch,
                           user: e.target.value
                       })}
                       size="sm" placeholder="Szukaj"
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
                        <Typography level="h2">Kontakty w obecnej akcji</Typography>
                    </TabHeader>
                    {loading && <LinearProgress/>}

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


                    <JourneysTable journeys={journeys}/>
                    {pagesNumber > 1 &&
                        <Pagination currentPage={currentPage} numberOfPages={pagesNumber} firstAndLast={!mobile}
                                    concise={mobile}
                                    margin={"10px 0 10px 0"}
                                    setPage={(page) => setCurrentPage(page)}/>}
                </div>}/>
            <Route path={"/:id"} element={<JourneyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default JourneysHome;