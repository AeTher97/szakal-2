import React from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";


const SecureRoute = ({children, ...props}) => {
    const {isAuthenticated} = useSelector(state => state.auth)
    const location = useLocation();

    return (isAuthenticated) ?
        children :
        <Navigate
            to="/login"
            state={{
                from: location.pathname
            }}
        />


};

export default SecureRoute;
