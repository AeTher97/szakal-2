import React, {useState} from 'react';
import {FormControl, FormLabel, Input, LinearProgress, Select, Typography} from "@mui/joy";
import CompaniesTable from "./CompaniesTable";
import {Route, Routes} from "react-router-dom";
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


const filters = (mobile, categories, categoryField, setCategoryField) => {
    if (categories) {
        return <>
            <FormControl size={"sm"} sx={{flex: mobile ? 1 : 0}}>
                <FormLabel>
                    Kategoria
                </FormLabel>
                <Select value={categoryField} style={{minWidth: 120}} onChange={(e, value) => setCategoryField(value)}>
                    {categories.map(category => {
                        return <Option value={category.name} key={category.id}>{category.name}</Option>
                    })}
                    <Option value={""}>Wszystkie</Option>
                </Select>
            </FormControl>
        </>
    }
}

const CompaniesHome = () => {

    const [nameSearch, setNameSearch] = useState("")
    const [categorySearch, setCategorySearch] = useState("")

    const [categoryField, setCategoryField] = useState("")
    const [nameSearchField, setNameSearchField] = useState("")

    const [currentPage, setCurrentPage] = useState(0);

    const mobile = useMobileSize();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {categories} = useCategories();
    const {companies, loading, pageNumber, addCompany} = useCompanyListWithCampaign(
        currentCampaign, currentPage,
        nameSearch === "" ? null : nameSearch,
        categorySearch === "" ? null : categorySearch);

    const [addCompanyOpen, setAddCompanyOpen] = useState(false);

    const updateFilters = () => {
        setNameSearch(nameSearchField);
        setCategorySearch(categoryField)
    }

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "auto", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Firmy</Typography>
                        <div>
                            <Button onClick={() => {
                                setAddCompanyOpen(true)
                            }}><AddIcon/>Dodaj</Button>
                        </div>
                    </TabHeader>

                    {loading && <LinearProgress/>}

                    <form onSubmit={e => {
                        e.preventDefault();
                        updateFilters();
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
                            <Input value={nameSearchField} onChange={(e) => setNameSearchField(e.target.value)}
                                   size="sm" placeholder="Szukaj"
                                   startDecorator={<SearchIcon/>}/>
                        </FormControl>
                        {filters(mobile, categories, categoryField, setCategoryField)}
                        <div>
                            <Button size={"sm"} type={"submit"}>Szukaj</Button>
                        </div>
                    </form>

                    <CompaniesTable companies={companies}/>
                    <AddCompanyDialog
                        open={addCompanyOpen}
                        close={() => setAddCompanyOpen(false)}
                        addCompany={addCompany}/>
                </div>}/>
            <Route path={"/:id"} element={<CompanyDetails/>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CompaniesHome;