import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import UserAvatar from "../UserAvatar";
import {Dropdown, Menu, MenuButton, MenuItem, Switch} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeAction, logoutAction} from "../../redux/ReducerActions";
import {useNavigate} from "react-router-dom";

const UserMenu = ({name, surname}) => {

    const mobile = useMobileSize();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {theme} = useSelector(state => state.theme);

    return (
        <div style={{margin: mobile ? 10 : 20}}>
            <Dropdown>
                <MenuButton
                    sx={{border: "none", padding: "0 10px 0 0"}}>
                    <UserAvatar name={name} surname={surname}/>
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => {
                        dispatch(changeThemeAction());
                    }}>
                        Dark Mode<Switch checked={theme === "dark"}/>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        dispatch(logoutAction());
                        navigate("/login");
                    }}>Logout</MenuItem>

                </Menu>
            </Dropdown>
        </div>
    );
};

UserMenu.propTypes = {};

export default UserMenu;