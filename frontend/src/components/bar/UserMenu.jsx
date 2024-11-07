import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import UserAvatar from "../UserAvatar";
import {Dropdown, Menu, MenuButton, MenuItem, Switch} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeAction, logoutAction} from "../../redux/ReducerActions";
import {useNavigate} from "react-router-dom";

const UserMenu = ({name, surname, image, id}) => {

    const mobile = useMobileSize();
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

UserMenu.propTypes = {};

export default UserMenu;