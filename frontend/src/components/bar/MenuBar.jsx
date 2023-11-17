import React, {useEffect, useState} from 'react';
import {Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useLocation, useNavigate} from "react-router-dom";

const MenuBar = () => {

    const [path, setPath] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location) {
            setPath(location.pathname.split("/")[2]);
        } else {
            setPath("companies")
        }
    }, [location]);


    return (
        <div style={{width: "100%"}}>
            {path && <Tabs sx={{bgcolor: 'transparent'}} onChange={(e, value) => {
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
                    <Tab value={"companies"}>Firmy</Tab>
                    <Tab value={"users"}>Użytkownicy</Tab>
                </TabList>
            </Tabs>}
        </div>
    );
};

export default MenuBar;