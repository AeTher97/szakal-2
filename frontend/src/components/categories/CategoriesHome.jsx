import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CategoriesTable from "./CategoriesTable";
import {useCategories} from "../../data/CategoriesData";
import TabHeader from "../main/TabHeader";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import CategoryDialog from "./CategoryDialog";

const CategoriesHome = () => {

    const {categories, loading, addCategory, modifyCategory} = useCategories();
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column", paddingBottom: 30}}>
                    <TabHeader>
                        <Typography level="h2">Branże</Typography>
                        <Button onClick={() => {
                            setAddCategoryOpen(true)
                        }}>
                            <AddIcon/>Dodaj branżę
                        </Button>
                    </TabHeader>
                    <CategoriesTable categories={categories} modifyCategory={modifyCategory}/>
                    <CategoryDialog open={addCategoryOpen} addCategory={addCategory}
                                    close={() => setAddCategoryOpen(false)}/>
                </div>}/>
            {/*<Route path={"/:id"} element={<CompanyDetails/>}/>*/}
            {/*<Route path={"/add"} element={<AddCompany/>}/>*/}
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CategoriesHome;