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
import Option from "@mui/joy/Option";
import SearchIcon from "@mui/icons-material/Search";
import React, {useEffect, useState} from "react";
import TabHeader from "../main/TabHeader";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import CompanyTable from "./CompanyTable";
import Pagination from "../misc/Pagination";
import AddCompanyDialog from "./AddCompanyDialog";
import {useMobileSize} from "../../utils/SizeQuery";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {useSelector} from "react-redux";
import {useCategories} from "../../data/CategoriesData";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import {useSearchWithPagination} from "../../utils/SearchHook";

const NAME = "name";
const CATEGORY = "category";
const STATUS = "status";
const HAS_ALUMNI = "hasAlumni";
const ALUMNI_DESCRIPTION = "alumniDescription";
const COMMITTEE = "committee";
const CAMPAIGN_NAME = "campaignName";
const SORT = "sort";

const CompanyList = () => {


    const mobile = useMobileSize();
    const {hasRight} = useAccessRightsHelper();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const [addCompanyOpen, setAddCompanyOpen] = useState(false);

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
    } = useSearchWithPagination([NAME, CATEGORY, STATUS, HAS_ALUMNI, ALUMNI_DESCRIPTION, COMMITTEE, CAMPAIGN_NAME, SORT],
        [{name: "sort", value: "name,ASC"}]);

    const {categories} = useCategories(searchLoaded);
    const {companies, loading, pageNumber, addCompany}
        = useCompanyListWithCampaign(
        currentCampaign,
        currentPage - 1,
        search,
        [searchLoaded, (currentCampaign !== '') ? true : null]
    );

    useEffect(() => {
        updatePageNumber(pageNumber);
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
                <Input value={searchNotSubmittedValue.name || ""}
                       onChange={(e) => {
                           updateSearch(NAME, e.target.value)
                       }}
                       size="sm" placeholder="Szukaj"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            {categories &&
                <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                    <FormLabel>
                        Kategoria
                    </FormLabel>
                    <Select value={searchNotSubmittedValue.category || ""} style={{minWidth: 120}}
                            onChange={(e, value) => {
                                updateSearch(CATEGORY, value);
                            }}>
                        {categories.map(category => {
                            return <Option value={category.name} key={category.id}>{category.name}</Option>
                        })}
                        <Option value={""}>Wszystkie</Option>
                    </Select>
                </FormControl>
            }
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Status
                </FormLabel>
                <Select value={searchNotSubmittedValue.status || ""} style={{minWidth: 120}}
                        onChange={(e, value) => {
                            updateSearch(STATUS, value);
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
                <Select value={!searchNotSubmittedValue.hasAlumni ? "" : searchNotSubmittedValue.hasAlumni}
                        style={{minWidth: 120}}
                        onChange={(e, value) => {
                            updateSearch(HAS_ALUMNI, value);
                        }}>
                    <Option value={""}>Tak/Nie</Option>
                    <Option value={true}>Tak</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Opis alumna
                </FormLabel>
                <Input value={searchNotSubmittedValue.alumniDescription || ""} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(ALUMNI_DESCRIPTION, e.target.value);
                       }} placeholder={"Szukaj"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Komitet alumna
                </FormLabel>
                <Input value={searchNotSubmittedValue.committee || ""} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(COMMITTEE, e.target.value)
                       }} placeholder={"Komitet"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Akcja
                </FormLabel>
                <Input value={searchNotSubmittedValue.campaignName || ""} style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(CAMPAIGN_NAME, e.target.value)
                       }} placeholder={"Akcja"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <div>
                <Button size={"sm"} type={"submit"}>Szukaj</Button>
            </div>
        </form>
    }

    return (
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

            <LinearProgress sx={{visibility: loading ? "visible" : "hidden", marginBottom: '5px'}}/>

            {!loading &&
                <CompanyTable companies={companies} updateSort={updateSort} search={search} clearSort={clearSort}/>}

            {loading && <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                {Array(10).fill(0).map((v, i) => {
                    return <Skeleton key={i} variant={"rectangular"} style={{height: 30}}/>
                })}
            </div>}

            {pageNumber > 1 && <Pagination currentPage={currentPage} numberOfPages={pageNumber}
                                           firstAndLast={!mobile} concise={mobile}
                                           margin={"10px 0 10px 0"}
                                           setPage={pageNumber => updateCurrentPage(pageNumber)}/>}


            <AddCompanyDialog
                open={addCompanyOpen}
                close={() => setAddCompanyOpen(false)}
                addCompany={addCompany}/>
        </div>
    );
};

export default CompanyList;