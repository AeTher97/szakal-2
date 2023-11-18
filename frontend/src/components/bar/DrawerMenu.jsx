import React, {useEffect, useState} from 'react';
import {Divider, Drawer, IconButton, List, ListItem, ListItemButton, Sheet} from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import {useAccessRights} from "../../data/UseAccessRights";
import SzakalLogo from "./SzakalLogo";
import {useLocation, useNavigate} from "react-router-dom";
import {USER_VIEWING} from "../../utils/AccessRights";


const MenuItem = ({children, to, close}) => {
    const navigate = useNavigate();

    const [path, setPath] = useState("/");
    const location = useLocation();

    useEffect(() => {
        if (location.pathname && location.pathname.split("/").length > 2) {
            setPath(location.pathname.split("/")[2]);
        } else {
            setPath("/")
        }
    }, [location]);

    return (
        <ListItem color={"primary"} onClick={() => {
            navigate(to)
            close();
        }}>
            <ListItemButton selected={path === to}>
                {children}
            </ListItemButton>
        </ListItem>
    );
};


const DrawerMenu = () => {

    const [open, setOpen] = useState(false);
    const {hasRight} = useAccessRights();

    const close = () => {
        setOpen(false);
    }

    return (
        <>
            <IconButton style={{margin: 10}}
                        onClick={() => setOpen(true)}>
                <MenuIcon/>
            </IconButton>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Sheet>
                    <SzakalLogo/>
                </Sheet>
                <Divider/>
                <List>
                    <MenuItem to={"/"} close={close}>Start</MenuItem>
                    <MenuItem to={"companies"} close={close}>Wszystkie Firmy</MenuItem>
                    <MenuItem to={"campaignCompanies"} close={close}>Firmy w tej akcji</MenuItem>
                    <MenuItem to={"categories"} close={close}>Branże</MenuItem>
                    <MenuItem to={"campaigns"} close={close}>Akcje</MenuItem>
                    {hasRight(USER_VIEWING) && <MenuItem to={"users"} close={close}>Użytkownicy</MenuItem>}
                </List>
            </Drawer>
        </>
    );
};

export default DrawerMenu;