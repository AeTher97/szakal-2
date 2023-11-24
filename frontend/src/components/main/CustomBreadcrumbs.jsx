import React from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import {Box, Breadcrumbs, Typography} from "@mui/joy";
import {useLocation} from "react-router-dom";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useSelector} from "react-redux";


const CustomBreadcrumbs = () => {
    const location = useLocation();
    const {items} = useSelector(state => state.knownItems);
    const slice = location.pathname.split("/")
        .slice(2, location.pathname.split("/").length);


    const pathMatches = [
        {path: "secure", component: <HomeIcon/>, pathOverride: "/secure/home"},
        {path: "companies", component: "Firmy"},
        {path: "categories", component: "Branże"},
        {path: "user-journeys", component: "Twoje kontakty"},
        {path: "journeys", component: "Kontakty w tej akcji"},
        {path: "users", component: "Użytkownicy"},
        {path: "campaigns", component: "Akcje"},
        {path: "profile", component: "Profil"},
        {path: "roles", component: "Role", pathOverride: "/secure/users"},
    ]

    const getPathMatch = (path, matchPath, last) => {
        let matched = pathMatches.find(match => match.path === matchPath);
        if (!matched) {
            if (items.find(item => item.id === matchPath)) {
                matched = {...items.find(item => item.id === matchPath)}
                matched.component = matched.name;
            }
        }
        if (matched && !last) {
            return <LinkWithRouter color={"neutral"} to={matched.pathOverride ? matched.pathOverride : path}
                                   sx={{display: "flex"}}>
                {matched.component}
            </LinkWithRouter>;
        } else if (matched && last) {
            return <Typography color={"primary"}>{matched.component}</Typography>
        } else {
            return "";
        }
    }

    let currentLevel = ""

    if (location.pathname.includes("home")) {
        return <></>
    }

    if (slice.length > 0) {
        return <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Breadcrumbs separator={<KeyboardArrowLeft sx={{mr: 0}}/>} size={"sm"} sx={{pl: 0}}>
                {location.pathname.split("/")
                    .slice(1, location.pathname.split("/").length)
                    .map((loc, index) => {
                        currentLevel += "/" + loc;
                        return <span
                            key={loc}>{getPathMatch(currentLevel, loc,
                            index === location.pathname.split("/").length - 2)}</span>
                    })}
            </Breadcrumbs>
        </Box>

    } else {
        return <></>
    }
};

export default CustomBreadcrumbs;