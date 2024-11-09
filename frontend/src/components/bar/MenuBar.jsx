import React, {useEffect, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router-dom";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {CAMPAIGN_MODIFICATION, JOURNEY_CREATION, USER_VIEWING} from "../../utils/AccessRights";

export const menuItems = [
    {path: "home", name: "Start"},
    {path: "companies", name: "Wszystkie Firmy"},
    {path: "journeys", name: "Kontakty w tej akcji"},
    {path: "user-journeys", name: "Twoje Kontakty", right: JOURNEY_CREATION},
    {path: "categories", name: "Kategorie"},
    {path: "campaigns", name: "Akcje", right: CAMPAIGN_MODIFICATION},
    {path: "users", name: "Użytkownicy", right: USER_VIEWING},
    {path: "profile", name: "Profil"},
    {path: "app-settings", name: "Ustawienia aplikacji"}
]

const MenuBar = () => {

    const [path, setPath] = useState("/");
    const navigate = useNavigate();
    const location = useLocation();
    const {hasRight} = useAccessRightsHelper();


    useEffect(() => {
        if (location.pathname && location.pathname.split("/").length > 2) {
            setPath(location.pathname.split("/")[2]);
        } else {
            setPath("/")
        }
    }, [location]);


    return (
        <Tabs style={{alignSelf: "flex-start", marginBottom: 5}}
              onChange={(e, value) => {
                  navigate(value);
              }} value={path}>
            <TabList disableUnderline
                     sx={{
                         justifyContent: 'center',
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
                                    }}>{item.name}</Tab>;
                    }
                })}
            </TabList>
        </Tabs>
    );
};

export default MenuBar;