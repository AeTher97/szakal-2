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
import TabHeader from "../misc/TabHeader";
import {COMPANY_MODIFICATION} from "../../utils/AccessRightsList";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import CompanyList from "./CompanyList";
import Pagination from "../misc/Pagination";
import AddCompanyDialog from "./AddCompanyDialog";
import {useMobileSize} from "../../utils/MediaQuery";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {useSelector} from "react-redux";
import {useCategories} from "../../data/CategoriesData";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import {useSearchWithPagination} from "../../utils/SearchHook";
import {v4 as uuidv4} from 'uuid';


const NAME = "name";
const CATEGORY = "category";
const STATUS = "status";
const HAS_ALUMNI = "hasAlumni";
const ALUMNI_DESCRIPTION = "alumniDescription";
const COMMITTEE = "committee";
const CAMPAIGN_NAME = "campaignName";
const SORT = "sort";
const PAGE_SIZE = "pageSize";

const CompanyFilters = () => {


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
    } = useSearchWithPagination([NAME, CATEGORY, STATUS, HAS_ALUMNI, ALUMNI_DESCRIPTION, COMMITTEE, CAMPAIGN_NAME, SORT, PAGE_SIZE],
        [{name: SORT, value: "name,ASC"}, {name: PAGE_SIZE, value: 10}]);

    const {categories} = useCategories(searchLoaded);
    const {companies, loading, pageNumber, totalCount, addCompany}
        = useCompanyListWithCampaign(
        currentCampaign,
        search,
        [searchLoaded, (currentCampaign !== '') ? true : null],
        currentPage - 1
    );

    useEffect(() => {
        updatePageNumber(pageNumber);
    }, [loading]);

    const renderFilters = () => {
        return <form onSubmit={e => {
            e.preventDefault();
            applySearch();
        }} style={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            alignItems: "flex-end"
        }}>
            <FormControl sx={{flex: 1}} size="sm">
                <FormLabel>Szukaj firmy</FormLabel>
                <Input data-testid="company-search-name"
                       value={searchNotSubmittedValue.name || ""}
                       onChange={(e) => {
                           updateSearch(NAME, e.target.value)
                       }}
                       size="sm" placeholder="Nazwa Firmy"
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            {categories &&
                <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                    <FormLabel>
                        Kategoria
                    </FormLabel>
                    <Select data-testid="company-search-category"
                            value={searchNotSubmittedValue.category || ""} style={{minWidth: 120}}
                            onChange={(e, value) => {
                                updateSearch(CATEGORY, value);
                            }}>
                        {categories.map(category => {
                            return <Option data-testid={`company-search-category-${category.name}`}
                                           value={category.name} key={category.id}>{category.name}</Option>
                        })}
                        <Option data-testid={`company-search-category-Wszystkie`} value={""}>Wszystkie</Option>
                    </Select>
                </FormControl>
            }
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Status
                </FormLabel>
                <Select data-testid="company-search-status"
                        value={searchNotSubmittedValue.status || ""} style={{minWidth: 120}}
                        onChange={(e, value) => {
                            updateSearch(STATUS, value);
                        }}>
                    <Option data-testid="company-search-status-free" value={"free"}>Wolna</Option>
                    <Option data-testid="company-search-status-taken" value={"taken"}>Zajęta</Option>
                    <Option data-testid="company-search-status-all" value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Posiada alumna
                </FormLabel>
                <Select data-testid="company-search-has-alumni"
                        value={!searchNotSubmittedValue.hasAlumni ? "" : searchNotSubmittedValue.hasAlumni}
                        style={{minWidth: 120}}
                        onChange={(e, value) => {
                            updateSearch(HAS_ALUMNI, value);
                        }}>
                    <Option data-testid="company-search-has-alumni-all" value={""}>Tak/Nie</Option>
                    <Option data-testid="company-search-has-alumni-yes" value={true}>Tak</Option>
                </Select>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Opis alumna
                </FormLabel>
                <Input data-testid="company-search-alumni-description"
                       value={searchNotSubmittedValue.alumniDescription || ""}
                       style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(ALUMNI_DESCRIPTION, e.target.value);
                       }} placeholder={"Opis Alumna"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Komitet alumna
                </FormLabel>
                <Input data-testid="company-search-alumni-committee"
                       value={searchNotSubmittedValue.committee || ""}
                       style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(COMMITTEE, e.target.value)
                       }} placeholder={"Komitet"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Akcja
                </FormLabel>
                <Input data-testid="company-search-campaign"
                       value={searchNotSubmittedValue.campaignName || ""}
                       style={{minWidth: 80, maxWidth: 105}}
                       onChange={(e) => {
                           updateSearch(CAMPAIGN_NAME, e.target.value)
                       }} placeholder={"Akcja"}
                       startDecorator={<SearchIcon/>}/>
            </FormControl>
            <div>
                <Button data-testid="company-search-category-button" size={"sm"} type={"submit"}>Szukaj</Button>
            </div>
        </form>
    }

    const renderActions = () => {
        return <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "flex-end",
            paddingBottom: mobile ? 15 : 0
        }}>
            {hasRight(COMPANY_MODIFICATION) &&
                <Button style={{flex: mobile ? 1 : 0}} color={"primary"}
                        data-testid="add-company-button"
                        onClick={() => {
                            setAddCompanyOpen(true)
                        }}><AddIcon/>Dodaj</Button>}
        </div>
    }

    return (
        <div style={{display: "flex", overflow: "auto", flexDirection: "column", paddingBottom: 10}}>
            <TabHeader>
                <Typography level="h2">Firmy</Typography>
                {!mobile && renderActions()}
            </TabHeader>
            {mobile && renderActions()}

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
                <CompanyList companies={companies} updateSort={updateSort} search={search} clearSort={clearSort}
                             numberOfItems={totalCount} setItemsPerPage={(count) => {
                    updateSearch(PAGE_SIZE, count);
                }} itemsPerPage={search.pageSize}/>}

            {loading && <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                {Array(10).fill(0).map((v, i) => {
                    return <Skeleton key={uuidv4()} variant={"rectangular"} style={{height: 30}}/>
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

export default CompanyFilters;