import {useEffect, useState} from "react";
import {removeNullFields} from "./ObjectUtils";
import {useSearchParams} from "react-router-dom";

export const sanitizeFilters = (value) => {
    return value.replace(/[^a-z0-9,\s]/gi, '');
}

export const useSearch = (fields = [], defaultValues = []) => {

    const [searchLoaded, setSearchLoaded] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const getInitialState = () => {
        const initialState = {};
        fields.forEach(field => {
            initialState[field] = null;
        });

        defaultValues.forEach(value => {
            initialState[value.name] = value.value;
        })

        return initialState;
    }

    const [tempSearch, setTempSearch] = useState(getInitialState);
    const [search, setSearch] = useState(getInitialState);

    useEffect(() => {
        if (searchLoaded) {
            return;
        }
        const currentValue = {...search};

        fields.forEach(field => {
            if (searchParams.get(field)) {
                currentValue[field] = sanitizeFilters(searchParams.get(field))
            }
        })

        setTempSearch(currentValue)
        setSearch(currentValue);
        setSearchLoaded(true);
    }, [searchParams]);


    useEffect(() => {
        if (search.pageSize !== tempSearch.pageSize && searchLoaded) {
            applySearch();
        }
    }, [search, tempSearch]);

    const updateSearch = (itemName, value) => {
        setTempSearch({
            ...tempSearch,
            [itemName]: value
        });
    }

    const updateSort = (colum, direction) => {
        setSearchParams(removeNullFields({
            ...tempSearch,
            sort: `${colum},${direction}`.replace(/[^a-z0-9,\s]/gi, '')
        }));
        setSearch(removeNullFields({
            ...tempSearch,
            sort: `${colum},${direction}`.replace(/[^a-z0-9,\s]/gi, '')
        }));
    }

    const clearSort = () => {
        setSearchParams(removeNullFields({
            ...tempSearch,
            sort: null
        }))
        setSearch(removeNullFields({
            ...tempSearch,
            sort: null
        }))
    }

    const applySearch = () => {
        setSearchParams(removeNullFields(tempSearch));
        setSearch({
            ...removeNullFields(tempSearch)
        })
    }

    return {search, searchNotSubmittedValue: tempSearch, searchLoaded, updateSearch, updateSort, clearSort, applySearch}
}

export const useSearchWithPagination = (fields = [], defaultValues = []) => {

    const searchValue = useSearch(fields, defaultValues);
    const {searchLoaded, search} = searchValue;
    const [pageNumber, setPageNumber] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [_, setSearchParams] = useSearchParams();
    const [pageNumberLoaded, setPageNumberLoaded] = useState(false);

    useEffect(() => {
        if (searchLoaded && pageNumber < currentPage && pageNumber !== 0) {
            setCurrentPage(pageNumber);
            setSearchParams({
                ...search,
                currentPage: pageNumber
            })
        }
    }, [pageNumber]);

    useEffect(() => {
        if (searchLoaded && search.currentPage) {
            setCurrentPage(Number(search.currentPage));
        }
        setPageNumberLoaded(true)
    }, [searchLoaded]);

    const updateCurrentPage = (page) => {
        setCurrentPage(page);
        setSearchParams({
            ...removeNullFields(search),
            currentPage: page
        })
    }

    const updatePageNumber = (pagesNumber) => {
        setPageNumber(pagesNumber)
    }


    return {...searchValue, searchLoaded: pageNumberLoaded, currentPage, updateCurrentPage, updatePageNumber}
}