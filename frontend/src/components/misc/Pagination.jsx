import React from 'react';
import Button from "@mui/joy/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import {Typography} from "@mui/joy";

const Pagination = ({
                        currentPage = 0, numberOfPages = 0, setPage = () => {
    },
                        firstAndLast = false, showPages = 5,
                        concise = false
                    }) => {

    if (concise) {
        showPages *= 0.6;
    }

    let low = currentPage - Math.floor(showPages / 2);
    if (low < 1) {
        low = 1;
    }
    let high = currentPage + Math.floor(showPages / 2);
    if (high > numberOfPages) {
        high = numberOfPages
    }

    const pages = [];
    for (let i = low; i <= high; i++) {
        pages.push(i);
    }


    return (
        <div style={{display: "flex", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap"}}>
            <div style={{display: "flex", gap: 5}}>
                {firstAndLast && currentPage !== 1 && <Button
                    size={"sm"} variant={"outlined"} onClick={() => setPage(1)}
                    color={"neutral"}><FirstPageIcon/>{concise ? "" : "Pierwsza"}</Button>}
                <Button size={"sm"} variant={"outlined"} onClick={() => setPage(currentPage - 1)}
                        style={{visibility: currentPage !== 1 ? "visible" : "hidden"}}
                        color={"neutral"}><KeyboardArrowLeft/>{concise ? "" : "Poprzednia"}</Button>
            </div>
            <div style={{display: "flex", gap: 5}}>
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
                    style={{visibility: currentPage === numberOfPages ? "hidden" : "visible"}} size={"sm"}
                    variant={"outlined"} onClick={() => {
                    setPage(currentPage + 1)
                }}
                    color={"neutral"}><KeyboardArrowRight/>{concise ? "" : "Następna"}</Button>
                {firstAndLast && currentPage !== numberOfPages && <Button
                    size={"sm"} variant={"outlined"} onClick={() => {
                    setPage(numberOfPages)
                }}
                    color={"neutral"}>{concise ? "" : "Ostatnia"}<LastPageIcon/>
                </Button>
                }
            </div>
        </div>
    )
        ;
};

export default Pagination;