import React, {useEffect, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router-dom";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {APP_SETTINGS, JOURNEY_CREATION, USER_VIEWING} from "../../utils/AccessRights";
import {useFullColumnSize} from "../../utils/SizeQuery";

export const menuItems = [
    {path: "home", name: "Start"},
    {path: "companies", name: "Wszystkie Firmy"},
    {path: "journeys", name: "Kontakty w tej akcji"},
    {path: "user-journeys", name: "Twoje Kontakty", right: JOURNEY_CREATION},
    {path: "categories", name: "Branże"},
    {path: "campaigns", name: "Akcje"},
    {path: "users", name: "Użytkownicy", right: USER_VIEWING},
    {path: "profile", name: "Profil"},
    {path: "app-settings", name: "Ustawienia aplikacji", right: APP_SETTINGS}
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
        <div style={{width: "100%"}}>
            {<Tabs sx={{backgroundColor: 'transparent'}} onChange={(e, value) => {
                navigate(value);
            }} value={path}>
                <TabList
                    sx={{
                        overflow: 'auto',
                        scrollSnapType: 'x mandatory',
                        '&::-webkit-scrollbar': {height: 5},
                        '&::-webkit-scrollbar-track': {background: "#f1f1f1"},
                        '&::-webkit-scrollbar-thumb': {background: " #888"},
                        '&::-webkit-scrollbar-thumb:hover': {background: " #555"},
                        p: 0.5,
                        gap: 0.5,
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'transparent',
                            // color: 'white',
                            fontWeight: 600
                        },
                        [`& .${tabClasses.root}[aria-selected="true"]:after`]: {
                            color: "primary.500"
                        }
                    }}>
                    {menuItems.map(item => {
                        if (item.right && !hasRight(item.right)) {
                            return undefined;
                        } else {
                            return <Tab key={item.name} value={item.path} sx={{
                                flex: 'none',
                                scrollSnapAlign: 'start'
                            }}>{item.name}</Tab>;
                        }
                    })}
                </TabList>
            </Tabs>}
        </div>
    );
};

export default MenuBar;