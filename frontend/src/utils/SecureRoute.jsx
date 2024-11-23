import React from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";


const SecureRoute = ({children}) => {
    const {isAuthenticated} = useSelector(state => state.auth)
    const location = useLocation();

    return isAuthenticated || (location.pathname === "/not-accepted" && location?.state.from) ?
        children :
        <Navigate
            to="/login"
            state={{
                from: location.pathname
            }}
        />
};

SecureRoute.propTypes = {
    children: PropTypes.node.isRequired
}

export default SecureRoute;
