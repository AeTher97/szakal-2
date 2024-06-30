import React, {useEffect, useState} from 'react';
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
    Typography
} from "@mui/joy";
import {Route, Routes, useSearchParams} from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import NotFoundScreen from "../../screens/NotFoundScreen";
import TabHeader from "../main/TabHeader";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import {useSelector} from "react-redux";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import AddCompanyDialog from "./AddCompanyDialog";
import SearchIcon from "@mui/icons-material/Search";
import {useMobileSize} from "../../utils/SizeQuery";
import Option from "@mui/joy/Option";
import {useCategories} from "../../data/CategoriesData";
import Pagination from "../misc/Pagination";
import CompaniesTable from "./CompaniesTable";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import {removeNullFields} from "../../utils/ObjectUtils";


const filters = (mobile, categories, search, setSearch) => {
    if (categories) {
        return <>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Kategoria
                </FormLabel>
                <Select value={search.category || ""} style={{minWidth: 120}}
                        onChange={(e, value) => {
                            setSearch({
                                ...search,
                                category: value
                            })
                        }}>
                    {categories.map(category => {
                        return <Option value={category.name} key={category.id}>{category.name}</Option>
                    })}
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Status
                </FormLabel>
                <Select value={search.status || ""} style={{minWidth: 120}}
                        onChange={(e, value) => {
                            setSearch({
                                ...search,
                                status: value
                            })
                        }}>
                    <Option value={"free"}>Wolna</Option>
                    <Option value={"taken"}>Zajęta</Option>
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Posiada alumna
                </FormLabel>
                <Select value={search.hasAlumni === undefined ? "" : search.hasAlumni} style={{minWidth: 120}}
                        onChange={(e, value) => {
                            setSearch({
                                ...search,
                                hasAlumni: value
                            })
                        }}>
                    <Option value={""}>Tak/Nie</Option>
                    <Option value={true}>Tak</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Opis alumna
                </FormLabel>
                <Input value={search.alumniDescription} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           setSearch({
                               ...search,
                               alumniDescription: e.target.value.replace(/[^a-z0-9\s]/gi, '')
                           })
                       }} placeholder={"Szukaj"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Komitet alumna
                </FormLabel>
                <Input value={search.committee} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           setSearch({
                               ...search,
                               committee: e.target.value.replace(/[^a-z0-9\s]/gi, '')
                           })
                       }} placeholder={"Komitet"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Akcja
                </FormLabel>
                <Input value={search.campaignName} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           setSearch({
                               ...search,
                               campaignName: e.target.value.replace(/[^a-z0-9\s]/gi, '')
                           })
                       }} placeholder={"Akcja"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
        </>
    }
}


const CompaniesHome = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [tempSearch, setTempSearch] = useState({
        name: null,
        category: null,
        status: null,
        hasAlumni: null,
        alumniDescription: null,
        committee: null,
        campaignName: null,
        sort: null
    });
    const [search, setSearch] = useState({
        name: null,
        category: null,
        status: null,
        hasAlumni: null,
        alumniDescription: null,
        committee: null,
        campaignName: null,
        sort: null
    });

    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {categories} = useCategories();
    const {companies, loading, pageNumber, addCompany}
        = useCompanyListWithCampaign(
        currentCampaign, currentPage - 1,
        search
    );
    const [addCompanyOpen, setAddCompanyOpen] = useState(false);

    useEffect(() => {
        if (pageNumber < currentPage && pageNumber !== 0) {
            setCurrentPage(pageNumber);
        }
    }, [pageNumber]);


    useEffect(() => {
        const currentValue = {
            name: searchParams.get("name") && searchParams.get("name").replace(/[^a-z0-9\s]/gi, ''),
            category: searchParams.get("category"),
            status: searchParams.get("status"),
            hasAlumni: searchParams.get("hasAlumni") ? searchParams.get("hasAlumni") === "true" : "",
            alumniDescription: searchParams.get("alumniDescription") && searchParams.get("alumniDescription").replace(/[^a-z0-9\s]/gi, ''),
            committee: searchParams.get("committee") && searchParams.get("committee").replace(/[^a-z0-9\s]/gi, ''),
            campaignName: searchParams.get("campaignName") && searchParams.get("campaignName").replace(/[^a-z0-9\s]/gi, ''),
            sort: searchParams.get("sort") && searchParams.get("sort").replace(/[^a-z0-9,\s]/gi, '')
        }
        setTempSearch(removeNullFields(currentValue))
        setSearch(removeNullFields(currentValue));
    }, [searchParams]);

    const setSort = (colum, direction) => {
        setSearchParams({
            ...tempSearch,
            sort: `${colum},${direction}`.replace(/[^a-z0-9,\s]/gi, '')
        })
    }

    const clearSort = () => {
        setSearchParams(removeNullFields({
            ...tempSearch,
            sort: null
        }))
    }

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
                <Input value={tempSearch.name || ""}
                       onChange={(e) => setTempSearch({
                           ...tempSearch,
                           name: e.target.value.replace(/[^a-z0-9\s]/gi, '')
                       })}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            {filters(mobile, categories, tempSearch, setTempSearch)}
            <div>
                <Button size={"sm"} type={"submit"}>Szukaj</Button>
            </div>
        </form>
    }

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "auto", flexDirection: "column", paddingBottom: 10}}>
                    <TabHeader>
                        <Typography level="h2">Firmy</Typography>
                        <div>
                            {hasRight(COMPANY_MODIFICATION) && <Button onClick={() => {
                                setAddCompanyOpen(true)
                            }}><AddIcon/>Dodaj</Button>}
                        </div>
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

                    {loading && <LinearProgress/>}

                    <CompaniesTable companies={companies} setSort={setSort} search={search} clearSort={clearSort}/>
                    {pageNumber > 1 && <Pagination currentPage={currentPage} numberOfPages={pageNumber}
                                                   firstAndLast={!mobile} concise={mobile}
                                                   margin={"10px 0 10px 0"}
                                                   setPage={pageNumber => setCurrentPage(pageNumber)}/>}

                    <AddCompanyDialog
                        open={addCompanyOpen}
                        close={() => setAddCompanyOpen(false)}
                        addCompany={addCompany}/>
                </div>
            }/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    )
        ;
};

export default CompaniesHome;