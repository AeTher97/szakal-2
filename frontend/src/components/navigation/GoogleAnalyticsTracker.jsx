import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";

const GoogleAnalyticsTracker = () => {

    const location = useLocation();

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

export default GoogleAnalyticsTracker;