import React from 'react';
import UserAvatar from "../misc/UserAvatar";
import {Dropdown, Menu, MenuButton, MenuItem, Switch} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeAction} from "../../redux/MiscActions";
import {useNavigate} from "react-router-dom";
import {logoutAction} from "../../redux/AuthActions";
import PropTypes from "prop-types";

const UserDropdownMenu = ({name, surname, image, id}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {theme} = useSelector(state => state.theme);

    return (
        <div style={{margin: 10}}>
            <Dropdown>
                <MenuButton
                    data-testid="user-avatar"
                    style={{border: "none", padding: "10px"}}>
                    <UserAvatar name={name} surname={surname} image={image} id={id}/>
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => {
                        dispatch(changeThemeAction());
                    }}>
                        Ciemny motyw<Switch checked={theme === "dark"}/>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(`/secure/profile`);
                    }}>Profil</MenuItem>
                    <MenuItem onClick={() => {
                        dispatch(logoutAction());
                        navigate("/login");
                    }}>Wyloguj się</MenuItem>

                </Menu>
            </Dropdown>
        </div>
    );
};

UserDropdownMenu.propTypes = {
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    image: PropTypes.string,
    id: PropTypes.string.isRequired
};

export default UserDropdownMenu;