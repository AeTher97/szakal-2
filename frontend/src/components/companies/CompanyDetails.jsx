import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";

const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    console.log(location.pathname.split("/")[3])

    useEffect(() => {
        dispatch(addKnownItem(location.pathname.split("/")[3], "IAESTE"));
        return () => {
            dispatch(removeKnownItem(location.pathname.split("/")[3]))
        }
    }, [location]);

    return (
        <div>
            Details of some company
        </div>
    );
};

export default CompanyDetails;