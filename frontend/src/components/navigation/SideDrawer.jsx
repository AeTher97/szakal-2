import React, {useEffect, useState} from 'react';
import {Divider, Drawer, IconButton, List, ListItem, ListItemButton, Sheet} from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import SzakalLogo from "../misc/SzakalLogo";
import {useLocation, useNavigate} from "react-router-dom";
import {menuItems} from "./NavigationBar";


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


const SideDrawer = () => {

    const [open, setOpen] = useState(false);
    const {hasRight} = useAccessRightsHelper();

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
                    {menuItems.map(item => {
                        if (item.right && !hasRight(item.right)) {
                            return undefined;
                        } else {
                            return <MenuItem key={item.name} to={item.path} close={close}>{item.name}</MenuItem>;
                        }
                    })}
                </List>
            </Drawer>
        </>
    );
};

export default SideDrawer;