import React from 'react';
import Button from "@mui/joy/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import {Typography} from "@mui/joy";
import PropTypes from "prop-types";

const getPagesArray = (currentPage, showPages, numberOfPages, concise) => {
    if (concise) {
        showPages *= 0.6;
    }


    let low = currentPage - Math.floor(showPages / 2);
    let high = currentPage + Math.floor(showPages / 2);

    if (low < 1) {
        high += 1 - low;
    }
    if (high > numberOfPages) {
        low -= high - numberOfPages;
        high = numberOfPages
    }
    if (low < 1) {
        low = 1;
    }

    const pages = [];
    for (let i = low; i <= high; i++) {
        pages.push(i);
    }
    return {pages, low, high};
}

const Pagination = ({
                        currentPage = 0,
                        numberOfPages = 0,
                        setPage = () => {
                        },
                        firstAndLast = false,
                        showPages = 5,
                        concise = false,
                        margin = "10"
                    }) => {

    const {pages, low, high} = getPagesArray(currentPage, showPages, numberOfPages, concise);

    const firstPage = currentPage === 1;
    const notFirstPage = !firstPage;
    const showFirstPageButton = firstAndLast;
    const firstPageButtonVisible = (!concise || firstAndLast) && notFirstPage

    const lastPage = currentPage === numberOfPages;
    const notLastPage = !lastPage;
    const showLastPageButton = firstAndLast;
    const lastPageButtonVisible = (!concise || firstAndLast) && notLastPage;

    return (
        <div style={{display: "flex", justifyContent: "space-between", margin, flexWrap: "wrap"}}>
            <div style={{display: "flex", gap: 5}}>
                {showFirstPageButton &&
                    <Button style={{visibility: firstPageButtonVisible ? "visible" : "hidden"}}
                            size={"sm"} variant={"outlined"} onClick={() => setPage(1)}
                            color={"neutral"}><FirstPageIcon/>{concise ? "" : "Pierwsza"}</Button>}
                <Button size={"sm"} variant={"outlined"} onClick={() => setPage(currentPage - 1)}
                        style={{visibility: currentPage !== 1 ? "visible" : "hidden"}}
                        color={"neutral"}><KeyboardArrowLeft/>{concise ? "" : "Poprzednia"}</Button>
            </div>
            <div style={{display: "flex", gap: 5}} data-testid="pagination-pages-container">
                {low > 1 && <Typography>...</Typography>}
                {pages.map(page => {
                    return <Button size={"sm"} variant={page === currentPage ? "soft" : "outlined"}
                                   onClick={() => {
                                       setPage(page)
                                   }}
                                   key={page}>{page}</Button>
                })}
                {high < numberOfPages && <Typography>...</Typography>}
            </div>
            <div style={{display: "flex", gap: 5}}>
                <Button
                    style={{visibility: notLastPage ? "visible" : "hidden"}} size={"sm"}
                    variant={"outlined"} onClick={() => {
                    setPage(currentPage + 1)
                }}
                    color={"neutral"}><KeyboardArrowRight/>{concise ? "" : "Następna"}</Button>
                {showLastPageButton && <Button style={{visibility: lastPageButtonVisible ? "visible" : "hidden"}}
                                               size={"sm"} variant={"outlined"} onClick={() => {
                    setPage(numberOfPages)
                }} color={"neutral"}>{concise ? "" : "Ostatnia"}<LastPageIcon/>
                </Button>
                }
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    firstAndLast: PropTypes.bool,
    showPages: PropTypes.number,
    concise: PropTypes.bool,
    margin: PropTypes.string
}

export default Pagination;