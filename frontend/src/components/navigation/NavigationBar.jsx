import React, {useEffect, useRef, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {CAMPAIGN_MODIFICATION, JOURNEY_CREATION, USER_VIEWING} from "../../utils/AccessRightsList";

export const menuItems = [
    {path: "/secure/home", name: "Start"},
    {path: "/secure/companies", name: "Wszystkie Firmy"},
    {path: "/secure/journeys", name: "Kontakty w tej akcji"},
    {path: "/secure/user-journeys", name: "Twoje Kontakty", right: JOURNEY_CREATION},
    {path: "/secure/categories", name: "Kategorie"},
    {path: "/secure/campaigns", name: "Akcje", right: CAMPAIGN_MODIFICATION},
    {path: "/secure/users", name: "Użytkownicy", right: USER_VIEWING},
    {path: "/secure/profile", name: "Profil"},
    {path: "/secure/app-settings", name: "Ustawienia aplikacji"}
]

const NavigationBar = () => {

    const [path, setPath] = useState("/");
    const navigate = useNavigate();
    const location = useLocation();
    const {hasRight} = useAccessRightsHelper();
    const ref = useRef();

    const horizontalScrollListener = (e) => {
        e.preventDefault();
        ref.current.scrollLeft += e.deltaY;
    }

    useEffect(() => {
        if (location.pathname && location.pathname.split("/").length > 2) {
            setPath(location.pathname.split("/").slice(0, 3).join("/"));
        } else {
            setPath("/")
        }
        return () => {
            window.removeEventListener("wheel", horizontalScrollListener)
        }
    }, [location]);

    return (
        <Tabs
            style={{marginBottom: 5}}
            onChange={(e, value) => {
                navigate(value);
                window.removeEventListener("wheel", horizontalScrollListener)
            }}
            value={path}
            onMouseEnter={() => {
                window.addEventListener("wheel", horizontalScrollListener, {passive: false})
            }}
            onMouseLeave={() => {
                window.removeEventListener("wheel", horizontalScrollListener)
            }}>
            <TabList ref={ref}
                     disableUnderline
                     sx={{
                         justifyContent: 'space-between',
                         overflow: 'auto',
                         scrollSnapType: 'x mandatory',
                         '&::-webkit-scrollbar': {height: 7},
                         '&::-webkit-scrollbar-track': {background: "#555"},
                         '&::-webkit-scrollbar-thumb': {background: "#888"},
                         '&::-webkit-scrollbar-thumb:hover': {background: "#f1f1f1", cursor: "pointer"},
                         padding: 0.5,
                         paddingBottom: 0.8,
                         bgcolor: 'background.level1',
                         borderRadius: 'md',
                         [`& .${tabClasses.root}[aria-selected="true"]`]: {
                             boxShadow: 'sm',
                             bgcolor: 'background.surface',
                             borderRadius: 'md',
                             // color: 'white',
                             fontWeight: 600
                         },
                         [`& .${tabClasses.root}[aria-selected="true"]:after`]: {
                             color: "primary.500",
                             bottom: 4
                         }
                     }}>
                {menuItems.map(item => {
                    if (item.right && !hasRight(item.right)) {
                        return undefined;
                    } else {
                        return <Tab key={item.name}
                                    indicatorInset
                                    value={item.path}
                                    sx={{
                                        flex: 'none',
                                        scrollSnapAlign: 'start'
                                    }}>{item.name}
                        </Tab>;
                    }
                })}
            </TabList>
        </Tabs>
    );
};

export default NavigationBar;