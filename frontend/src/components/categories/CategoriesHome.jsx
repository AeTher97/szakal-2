import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {LinearProgress, Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CategoriesTable from "./CategoriesTable";
import {useCategories} from "../../data/CategoriesData";
import TabHeader from "../main/TabHeader";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import CategoryDialog from "./CategoryDialog";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/SizeQuery";

const CategoriesHome = () => {

    const mobile = useMobileSize();
    const [currentPage, setCurrentPage] = useState(1);
    const {categories, loading, addCategory, modifyCategory, pageNumber} = useCategories(currentPage - 1);
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

                    {loading && <LinearProgress/>}

                    <CategoriesTable categories={categories} modifyCategory={modifyCategory}/>
                    <CategoryDialog open={addCategoryOpen} addCategory={addCategory}
                                    close={() => setAddCategoryOpen(false)}/>
                    {pageNumber > 1 && <Pagination firstAndLast={!mobile} concise={mobile} numberOfPages={pageNumber}
                                                   currentPage={currentPage}
                                                   setPage={(page) => setCurrentPage(page)}/>}
                </div>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CategoriesHome;