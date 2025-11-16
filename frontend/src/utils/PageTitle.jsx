import {useEffect} from "react";
import PropTypes from "prop-types";
import CompanyJourneys from "../components/companies/cards/CompanyJourneys";

export const isDevEnv = () => {
    return import.meta.env.DEV;
}

export const usePageTitle = (title = "Szakal 2", trigger = null) => {

    const setDefaultTitle = () => {
        if (isDevEnv()) {
            document.title = "Szakal 2 (Development)";
        } else {
            document.title = "Szakal 2";
        }
    }

    useEffect(() => {
        console.log("firing this")
        if (isDevEnv()) {
            document.title = `${title} (Development)`;
        } else {
            document.title = title;
        }
        return () => {
            console.log("firting return")
            setDefaultTitle()
        }
    }, [trigger]);
}

CompanyJourneys.propTypes = {
    title: PropTypes.string.isRequired,
    trigger: PropTypes.object
}