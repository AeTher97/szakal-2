import React, {useEffect, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router-dom";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {USER_VIEWING} from "../../utils/AccessRights";

export const menuItems = [
    {path: "home", name: "Start"},
    {path: "companies", name: "Wszystkie Firmy", right: USER_VIEWING},
    {path: "journeys", name: "Kontakty w tej akcji"},
    {path: "categories", name: "Branże"},
    {path: "campaigns", name: "Akcje"},
    {path: "users", name: "Użytkownicy"}
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
                            return <Tab key={item.name} value={item.path}>{item.name}</Tab>;
                        }
                    })}
                </TabList>
            </Tabs>}
        </div>
    );
};

export default MenuBar;