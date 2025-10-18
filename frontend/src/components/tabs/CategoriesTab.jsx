import React, {useState} from 'react';
import {Route, Routes} from "react-router";
import {LinearProgress, Typography} from "@mui/joy";
import NotFoundScreen from "../../screens/NotFoundScreen";
import CategoriesTable from "../categories/CategoriesTable";
import {useCategories} from "../../data/CategoriesData";
import TabHeader from "../misc/TabHeader";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import CategoryDialog from "../categories/CategoryDialog";
import Pagination from "../misc/Pagination";
import {useMobileSize} from "../../utils/MediaQuery";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {CATEGORY_MODIFICATION} from "../../utils/AccessRightsList";

const CategoriesTab = () => {

    const mobile = useMobileSize();
    const [currentPage, setCurrentPage] = useState(1);
    const {categories, loading, addCategory, modifyCategory, pageNumber}
        = useCategories(true, currentPage - 1);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const {hasRight} = useAccessRightsHelper();

    return (
        <Routes>
            <Route path={"/"} element={
                <div style={{display: "flex", overflow: "hidden", flexDirection: "column"}}>
                    <TabHeader>
                        <Typography level="h2">Kategorie</Typography>
                        {hasRight(CATEGORY_MODIFICATION) && <Button onClick={() => {
                            setAddCategoryOpen(true)
                        }}>
                            <AddIcon/>Dodaj kategorię
                        </Button>}
                    </TabHeader>

                    <LinearProgress style={{visibility: loading ? "visible" : "hidden"}}/>

                    <CategoriesTable categories={categories} modifyCategory={modifyCategory}/>
                    <CategoryDialog open={addCategoryOpen} addCategory={addCategory}
                                    close={() => setAddCategoryOpen(false)}/>
                    {pageNumber > 1 && <Pagination firstAndLast={!mobile} concise={mobile} numberOfPages={pageNumber}
                                                   currentPage={currentPage}
                                                   margin={"10px 0 10px 0"}
                                                   setPage={(page) => setCurrentPage(page)}/>}
                </div>}/>
            <Route path={"/*"} element={<NotFoundScreen/>}/>
        </Routes>
    );
};

export default CategoriesTab;