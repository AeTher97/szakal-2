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
        </>
    }
}


const CompaniesHome = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [tempSearch, setTempSearch] = useState({
        name: null,
        category: null,
        status: null
    });
    const [search, setSearch] = useState({
        name: null,
        category: null,
        status: null
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
        const currentValue = {
            name: searchParams.get("name"),
            category: searchParams.get("category"),
            status: searchParams.get("status")
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
                <Input value={tempSearch.name || ""}
                       onChange={(e) => setTempSearch({
                           ...tempSearch,
                           name: e.target.value
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

                    <CompaniesTable companies={companies}/>
                    {pageNumber > 1 && <Pagination currentPage={currentPage} numberOfPages={pageNumber}
                                                   firstAndLast={!mobile} concise={mobile}
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