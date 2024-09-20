import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const GTracker = () => {

    const {theme} = useSelector(state => state.theme);

    const location = useLocation();
    console.log(theme)

    useEffect(() => {
        if (location) {
            console.debug("marking page view", location.pathname)
            window.gtag("event", "page_view", {
                page_path: location.pathname,
            });
        }
    }, [location]);

    return <></>
};

export default GTracker;