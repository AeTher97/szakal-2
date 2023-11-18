import React, {useEffect, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router-dom";
import {useAccessRights} from "../../data/UseAccessRights";
import {USER_VIEWING} from "../../utils/AccessRights";

const MenuBar = () => {

    const [path, setPath] = useState("/");
    const navigate = useNavigate();
    const location = useLocation();
    const {hasRight} = useAccessRights();


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
                    <Tab value={"/"}>Start</Tab>
                    <Tab value={"companies"}>Wszystkie Firmy</Tab>
                    <Tab value={"campaignCompanies"}>Firmy w tej akcji</Tab>
                    <Tab value={"categories"}>Branże</Tab>
                    <Tab value={"campaigns"}>Akcje</Tab>
                    {hasRight(USER_VIEWING) && <Tab value={"users"}>Użytkownicy</Tab>}
                </TabList>
            </Tabs>}
        </div>
    );
};

export default MenuBar;